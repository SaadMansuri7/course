import traceback
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import re
# import google.generativeai as genai
from groq import Groq
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled
from fastapi.middleware.cors import CORSMiddleware
# from googletrans import Translator
from deep_translator import GoogleTranslator
import fitz
from docx import Document
import json
from fastapi import HTTPException

load_dotenv()
# genai.configure(api_key=os.getenv("GROQ_API_KEY"))
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
print('````````````````````````````````````````````````````````````````````````````api key being used : ',os.getenv("GROQ_API_KEY"))

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def translate_text(text: str, dest_lang: str = 'en', chunk_size: int = 4500) -> str:
    translated_chunks = []
    for i in range(0, len(text), chunk_size):
        chunk = text[i:i+chunk_size]
        translated = GoogleTranslator(source='auto', target=dest_lang).translate(chunk)
        translated_chunks.append(translated)
    return " ".join(translated_chunks)

class YouTubeLink(BaseModel):
    url: str
    language: str

# === 1. YouTube URL Endpoint ===
@app.post("/generate-course")
def generate_course(data: YouTubeLink):
    try:
        # print('url : ', data.url)
        video_id = data.url.split("v=")[-1].split("&")[0]
        # print('id', video_id)
        target_language = data.language.lower()
        
        # Create an instance of YouTubeTranscriptApi
        api = YouTubeTranscriptApi()
        
        # Use the 'list' method to get available transcripts
        available_transcripts = api.list(video_id)
        # print("Available transcripts:", available_transcripts)

        try:
            transcript = available_transcripts.find_manually_created_transcript([t.language_code for t in available_transcripts])
            # print(f"Using manually created transcript in: {transcript.language}")
        except:
            transcript = available_transcripts.find_generated_transcript([t.language_code for t in available_transcripts])
            # print(f"Using auto-generated transcript in: {transcript.language}")

        
        # Try to fetch transcript using the 'fetch' method
        transcript_data = transcript.fetch(video_id)
        # print('Fetched transcript data:', transcript_data)
        
        # Extract text from transcript data
        if hasattr(transcript_data, 'snippets'):
            transcript_text = " ".join(snippet.text for snippet in transcript_data.snippets)
        elif isinstance(transcript_data, list):
            transcript_text = " ".join([item.get("text", "") for item in transcript_data])
        elif isinstance(transcript_data, dict):
            transcript_text = transcript_data.get("text", str(transcript_data))
        else:
            transcript_text = str(transcript_data)
        
        # print('Extracted transcript length:', len(transcript_text), 'and entire text  : ',transcript_text)

        if transcript.language_code.lower() != target_language:
            # print(f"Translating transcript to {target_language}...")
            transcript_text = translate_text(transcript_text, dest_lang=target_language)
        else:
            print("Transcript already in desired language. No translation needed.")
        
        if transcript_text and len(transcript_text.strip()) > 0:
            return process_transcript_with_ai(transcript_text)
            # print('transcripted text : ', transcript_text)
        else:
            raise HTTPException(status_code=404, detail="No transcript content found.")
            
    except NoTranscriptFound:
        raise HTTPException(status_code=404, detail="Transcript not found for this video.")
    except TranscriptsDisabled:
        raise HTTPException(status_code=403, detail="Transcripts are disabled for this video.")
    except Exception as e:
        print(f"Exception type: {type(e)}")
        print(f"Exception message: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# === 2. File Upload Endpoint ===
@app.post("/generate-course-from-file")
async def generate_course_from_file(file: UploadFile = File(...)):
    try:
        # Step 1: Read file content
        contents = await file.read()
        text = ""

        # Step 2: Detect file type and extract text
        if file.filename.endswith(".txt"):
            text = contents.decode("utf-8")
        elif file.filename.endswith(".pdf"):
            with open("temp.pdf", "wb") as f:
                f.write(contents)
            doc = fitz.open("temp.pdf")
            text = "\n".join([page.get_text() for page in doc])
        elif file.filename.endswith(".docx"):
            with open("temp.docx", "wb") as f:
                f.write(contents)
            doc = Document("temp.docx")
            text = "\n".join([para.text for para in doc.paragraphs])
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type.")
        # print('Extracted text ::: ',text)

        return process_transcript_with_ai(text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === Shared AI Call Function ===
def process_transcript_with_ai(transcript: str):
    prompt = f"""You are an expert AI course generator. Given the transcript of a lecture, your task is to generate a complete structured course in JSON format. The course should be divided into logical units (minimum 3 units), each roughly based on 5-10 minutes of content or topic change. Every unit must contain at least:
-1 clear and relevant title  
-2-3 flashcards (short Q&A)  
-5+ MCQs with options and correct answer  
-2-3 FAQs
Respond with only raw JSON. Use only double quotes for keys and string values. No Markdown formatting, no comments, no explanations.
Must Use this exact structure:
{{
  "course_title": "Generated Course Title",
  "instructor": null,
  "rating": 0.0,
  "level": "as per you like Begginear Intermidiate Advance",
  "duration": 'approximate duration',
  "courseData": {{
    "units": [
      {{
        "unit_title": "Unit Title",
        "summary": "Detailed summary of this unit (1-2 paragraphs).",
        "isCompleted": false,
        "flashcards": [ {{"question": "What is ...?", "answer": "..."}} ],
        "mcqs": [ {{ "question": "Which of the following is true about ...?", "options": ["A", "B", "C", "D"], "answer": "B" }} ],
        "faqs": [ {{ "question": "Why is ... important?", "answer": "..."}} ]
      }}
    ]
  }}
}}
Now generate the course JSON for the following transcript:
{transcript}
"""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{ "role": "user", "content": prompt }],
            max_tokens=32000,
            temperature=0.7
        )
        ai_content = response.choices[0].message.content
        if ai_content.startswith("```"):
            ai_content = re.sub(r"^```(?:json)?\s*|\s*```$", "", ai_content.strip(), flags=re.IGNORECASE)
        ai_content = re.sub(r"(?<=:\s)'([^']*)'", r'"\1"', ai_content)
        result = json.loads(ai_content)
        # print('/////////////////////////////////////////generated course :: ',result)
        return {"course": result}
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response as JSON. Error: {str(e)} and raw : {ai_content}")
