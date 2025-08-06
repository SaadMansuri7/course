import { useEffect, useState } from "react"
import { useCourseContext } from "../context/CourseContext"
import { getEnrolments, updateEnrollmentState } from "../services/enrollmentServices"
import { auth } from "../firebase"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronUp, ChevronDown, Star, StarHalf } from 'lucide-react'
import Navbar from "../components/Navbar"

const StartCourse = () => {

    const { courses, setCourses, enrolledCourses, setEnrolledCourses, flashcardIndex, setFlashcardIndex, courseToStart, setCourseToStart, currentUnitIndex, setCurrentUnitIndex } = useCourseContext()
    const { id } = useParams()
    const [expandedIndex, setExpandedIndex] = useState()
    const [selectedOption, setSelectedOption] = useState({ index: null, text: '' })
    const [mcqResults, setMcqResults] = useState({})
    const [activeTab, setActiveTab] = useState("course")
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchEnrollments() {
            setIsLoading(true)
            const userId = auth.currentUser.uid
            const res = await getEnrolments(userId)
            setEnrolledCourses(res.data)
            const enrollments = res.data
            console.log('fetched enrollments : ', enrollments)
            const courseToStart = enrollments.find((c) => {
                console.log('course Id : ', c.courseId)
                console.log('Id : ', id)
                return String(c.courseId) === String(id)
            });
            console.log('course to start : ', courseToStart)
            setCourseToStart(courseToStart)
            setIsLoading(false)
        }
        fetchEnrollments()
    }, [])

    const toggleUnit = (index) => {
        setExpandedIndex((prev) => (prev === index ? null : index))
    }
    const handleOptionChange = (index, optText, mcqIndex) => {
        setSelectedOption(prev => ({
            ...prev,
            [mcqIndex]: {
                index: index,
                text: optText
            }
        }))
    }
    const handleSubmit = (selectedOpt, selectedIndex, answerLetter, mcqIndex) => {
        const answerIndex = answerLetter.charCodeAt(0) - 65
        const isCorrect = selectedIndex === answerIndex
        setMcqResults((prev) => ({
            ...prev,
            [mcqIndex]: { selected: selectedOpt, correctAnswerIndex: answerIndex, selectedIndex, isCorrect }
        }))
    }

    const handleNextUnit = async () => {
        const userId = auth.currentUser.uid
        const courseId = courseToStart.courseId
        console.log('course id: ', courseId)
        const course = enrolledCourses.find((c) => String(c.courseId) === String(id))
        if (course) {
            course.course.courseData.units[currentUnitIndex].isCompleted = true;
        }
        await updateEnrollmentState(userId, courseId, true, currentUnitIndex)
        const isLastUnit = currentUnitIndex === course.course.courseData.units.length - 1;
        if (!isLastUnit) {
            setCurrentUnitIndex((prev) => prev + 1);
            setFlashcardIndex(0);
            setSelectedOption({});
            setMcqResults({});
        } else {
            setFlashcardIndex(0);
            setSelectedOption({});
            setMcqResults({});
            navigate(`/course/${id}/completed`)
        }
    }

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = { role: 'user', content: input }
        setMessages((prev) => [...prev, userMessage])
        setInput("")

        try {
            const apiKey = import.meta.env.VITE_GEMINI_CHAT_KEY
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: input }]
                        }
                    ]
                })
            })

            const data = await response.json()
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response."
            setMessages((prev) => [...prev, { role: 'ai', content: reply }])
        } catch (error) {
            console.log('error from gemeni : ', error)
            setMessages((prev) => [...prev, { role: "ai", content: "Something went wrong. Please try again." }])
        }
    }

    const renderStars = () => {
        const stars = [];
        const rating = enrolledCourses?.rating && enrolledCourses.rating
        const totalStars = 5
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} className="text-yellow-500 w-4 h-4 fill-yellow-500" />);
        }

        if (hasHalfStar) {
            stars.push(<StarHalf key="half" className="text-yellow-500 w-4 h-4 fill-yellow-500" />);
        }

        while (stars.length < totalStars) {
            stars.push(<Star key={`empty-${stars.length}`} className="text-gray-300 w-4 h-4" />);
        }

        return stars;
    }

    const units = courseToStart?.course?.courseData?.units

    const showSkeleton = () => {
        return (<div className="flex flex-col md:flex-row md:space-x-8 px-4 md:px-12 py-8 animate-pulse">

            <div className="flex-1 space-y-6">
                <div className="h-5 bg-gray-300 w-1/4 rounded"></div>

                <div className="flex flex-wrap gap-4 mt-4">
                    <div className="h-6 bg-gray-300 w-20 rounded"></div>
                    <div className="h-6 bg-gray-300 w-20 rounded"></div>
                    <div className="h-6 bg-gray-300 w-24 rounded"></div>
                    <div className="h-6 bg-gray-300 w-32 rounded"></div>
                </div>

                <div className="border rounded-lg p-6 space-y-4 mt-6">
                    <div className="h-6 bg-gray-300 w-3/4 rounded"></div>
                    <div className="h-4 bg-gray-300 w-full rounded"></div>
                    <div className="h-4 bg-gray-300 w-5/6 rounded"></div>
                    <div className="h-4 bg-gray-300 w-2/3 rounded"></div>

                    <div className="mt-6 space-y-3">
                        <div className="h-5 bg-gray-300 w-1/2 rounded"></div>

                        {[1, 2, 3, 4].map((_, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                                <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
                            </div>
                        ))}

                        <div className="h-10 w-24 bg-gray-300 rounded mt-4"></div>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-1/3 space-y-4 mt-8 md:mt-0">
                <div className="flex space-x-4 border-b pb-2">
                    <div className="h-6 w-24 bg-gray-300 rounded"></div>
                    <div className="h-6 w-20 bg-gray-300 rounded"></div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                    {[1, 2, 3].map((_, index) => (
                        <div key={index} className="h-10 bg-gray-300 rounded"></div>
                    ))}
                </div>
            </div>
        </div>)
    }

    return (
        <>
            <Navbar />
            {isLoading ? showSkeleton() : <div className="px-4 md:px-16 lg:px-20 mx-auto max-w-screen-2xl">
                <div className="flex flex-col md:flex-row gap-8 py-10">
                    <div className="w-full md:w-2/3">
                        {courseToStart && (
                            <div className="space-y-8">
                                <h1 className="text-4xl font-bold leading-tight text-gray-900">
                                    {courseToStart.course_title}
                                </h1>

                                <p className="text-gray-700 text-lg">
                                    Instructor: <span className="font-semibold text-black">{courseToStart.instructor || 'John Doe'}</span>
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center">
                                    <div>
                                        <div className="flex items-center justify-center gap-x-2">
                                            <div className="flex gap-x-1">{renderStars()}</div>
                                            <p className="font-bold text-lg">{courseToStart.course.rating}</p>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">Ratings</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{units?.length > 0 ? units?.length : 0}</p>
                                        <p className="text-gray-600 text-sm mt-1">Lessons</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{courseToStart.course.level}</p>
                                        <p className="text-gray-600 text-sm mt-1">Level</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">~{courseToStart.course.duration}</p>
                                        <p className="text-gray-600 text-sm mt-1">Duration</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="border rounded-lg p-6 bg-white shadow-sm">
                                        <h2 className="text-2xl font-semibold mb-3">
                                            {units?.length > 0 && units[currentUnitIndex].unit_title}
                                        </h2>
                                        <p className="text-gray-700 mb-5">
                                            {units?.length > 0 && units[currentUnitIndex].summary}
                                        </p>

                                        <h3 className="text-lg font-semibold mb-2">MCQs</h3>
                                        {units?.length > 0 && units[currentUnitIndex].mcqs.map((mcq, mcqIndex) => (
                                            <div key={mcqIndex} className="mb-6 p-4 border rounded bg-gray-50">
                                                <div className="font-medium mb-3">{mcq.question}</div>
                                                <ul className="space-y-2">
                                                    {mcq.options.map((opt, optInd) => {
                                                        const selectedIdx = selectedOption[mcqIndex]?.index;
                                                        const hasSubmitted = mcqResults.hasOwnProperty(mcqIndex);
                                                        const answerIndex = mcq.answer.charCodeAt(0) - 65;
                                                        const isCorrect = optInd === answerIndex;
                                                        const wasSelected = mcqResults[mcqIndex]?.selectedIndex === optInd;

                                                        let optionStyle = "text-gray-700";

                                                        if (hasSubmitted) {
                                                            if (wasSelected && isCorrect)
                                                                optionStyle = "text-green-900 font-semibold bg-green-300 rounded px-2 py-1";
                                                            else if (wasSelected && !isCorrect)
                                                                optionStyle = "text-red-900 font-semibold bg-red-300 rounded px-2 py-1";
                                                            else if (!wasSelected && isCorrect)
                                                                optionStyle = "text-green-700 bg-green-100 rounded px-2 py-1";
                                                        }

                                                        return (
                                                            <li
                                                                key={optInd}
                                                                className="flex items-center cursor-pointer"
                                                                onClick={() => handleOptionChange(optInd, opt, mcqIndex)}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={`mcq-${mcqIndex}`}
                                                                    checked={selectedIdx === optInd}
                                                                    disabled={hasSubmitted}
                                                                    onChange={() => { }}
                                                                    className="mt-1 mr-3 pointer-events-none"
                                                                />
                                                                <span className={optionStyle}>{opt}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                                <button
                                                    onClick={() =>
                                                        handleSubmit(
                                                            selectedOption[mcqIndex]?.text,
                                                            selectedOption[mcqIndex]?.index,
                                                            mcq.answer,
                                                            mcqIndex
                                                        )
                                                    }
                                                    disabled={mcqResults.hasOwnProperty(mcqIndex)}
                                                    className={`mt-5 px-5 py-2 rounded text-white ${mcqResults.hasOwnProperty(mcqIndex)
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-blue-600 hover:bg-blue-700"
                                                        }`}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        ))}

                                        <h3 className="text-lg font-semibold mb-2">Flashcards</h3>
                                        {units?.length > 0 && units[currentUnitIndex].flashcards.length > 0 && (
                                            <div className="mb-6 p-4 border rounded bg-gray-50">
                                                <div className="font-medium mb-2">
                                                    {units[currentUnitIndex].flashcards[flashcardIndex].question}
                                                </div>
                                                <div className="text-gray-700 mb-3">
                                                    {units[currentUnitIndex].flashcards[flashcardIndex].answer}
                                                </div>
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    onClick={() => setFlashcardIndex((prev) =>
                                                        prev + 1 <
                                                            units[currentUnitIndex].flashcards.length
                                                            ? prev + 1
                                                            : 0
                                                    )}
                                                >
                                                    Next Flashcard
                                                </button>
                                            </div>
                                        )}

                                        <h3 className="text-lg font-semibold mb-2">FAQs</h3>
                                        {units?.length > 0 && units[currentUnitIndex].faqs.map((faq, index) => (
                                            <div key={index} className="mb-4 p-4 border rounded bg-gray-100">
                                                <div className="font-medium text-blue-900">{faq.question}</div>
                                                <div className="text-gray-700">{faq.answer}</div>
                                            </div>
                                        ))}

                                        <div className="flex justify-between pt-6">
                                            <button
                                                disabled={currentUnitIndex === 0}
                                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                                                onClick={() => {
                                                    setCurrentUnitIndex((prev) => prev - 1);
                                                    setFlashcardIndex(0);
                                                    setSelectedOption({});
                                                    setMcqResults({});
                                                }}
                                            >
                                                Previous
                                            </button>
                                            {currentUnitIndex === units.length - 1 ? <button
                                                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                                                onClick={handleNextUnit}
                                            >
                                                Complete Course
                                            </button> : <button
                                                disabled={
                                                    units?.length > 0 && currentUnitIndex === units.length - 1
                                                }
                                                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                                                onClick={handleNextUnit}
                                            >
                                                Next
                                            </button>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-1/3">
                        <div className="flex border-b border-gray-300 mb-4">
                            <button
                                onClick={() => setActiveTab("course")}
                                className={`px-4 py-2 font-medium transition-all ${activeTab === "course"
                                    ? "text-purple-600 border-b-2 border-purple-600"
                                    : "text-gray-600 hover:text-purple-600"
                                    }`}
                            >
                                Course Content
                            </button>
                            <button
                                onClick={() => setActiveTab("ai")}
                                className={`px-4 py-2 font-medium transition-all ${activeTab === "ai"
                                    ? "text-purple-600 border-b-2 border-purple-600"
                                    : "text-gray-600 hover:text-purple-600"
                                    }`}
                            >
                                AI Assistant
                            </button>
                        </div>

                        <div className="bg-white p-5 rounded-md shadow-md transition-all h-[calc(100vh-100px)] overflow-y-auto">
                            {activeTab === "course" && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-800">Course Content</h2>
                                    <ul className="space-y-3">
                                        {units?.length > 0 && units.map((unit, index) => (
                                            <li
                                                key={index}
                                                className="border border-gray-200 rounded-lg shadow-sm hover:shadow transition"
                                            >
                                                <button
                                                    className="w-full text-left flex justify-between items-center p-4"
                                                    onClick={() => toggleUnit(index)}
                                                >
                                                    <h3 className="text-base font-semibold text-gray-800">
                                                        {unit.unit_title}
                                                    </h3>
                                                    {expandedIndex === index ? (
                                                        <ChevronUp size={18} />
                                                    ) : (
                                                        <ChevronDown size={18} />
                                                    )}
                                                </button>
                                                {expandedIndex === index && (
                                                    <div className="px-4 pb-4 text-gray-600 text-sm">
                                                        <p>{unit.summary}</p>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === "ai" && (
                                <div className="space-y-4 flex flex-col h-full">
                                    <p className="text-gray-600 text-sm">Do you have any question about this course?</p>
                                    <div className="flex flex-col gap-2 h-full overflow-y-auto">
                                        {messages.map((msg, i) => (
                                            <div
                                                key={i}
                                                className={`p-3 rounded-md text-sm max-w-[75%] break-words ${msg.role === "user"
                                                    ? "bg-purple-100 text-purple-800 self-end"
                                                    : "bg-gray-100 text-gray-800 self-start"
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto pt-4">
                                        <textarea
                                            placeholder="Ask a question"
                                            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            rows={3}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                        />
                                        <button
                                            className="w-full mt-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                                            onClick={handleSend}
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>}
        </>
    );

}
export default StartCourse
