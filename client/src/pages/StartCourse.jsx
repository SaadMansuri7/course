import { useEffect, useState } from "react"
import { useCourseContext } from "../context/CourseContext"
import { getEnrolments } from "../services/enrollmentServices"
import { auth } from "../firebase"
import { useParams } from "react-router-dom"
import { ChevronUp, ChevronDown, Key } from 'lucide-react'
import Navbar from "../components/Navbar"

const StartCourse = () => {

    const { courses, setCourses, setEnrolledCourses, flashcardIndex, setFlashcardIndex, courseToStart, setCourseToStart, currentUnitIndex, setCurrentUnitIndex } = useCourseContext()
    const { id } = useParams()
    const [expandedIndex, setExpandedIndex] = useState()
    const [selectedOption, setSelectedOption] = useState({ index: null, text: '' })

    useEffect(() => {
        async function fetchEnrollments() {
            const userId = auth.currentUser.uid
            const res = await getEnrolments(userId)
            setEnrolledCourses(res.data)
            const enrollments = res.data
            console.log('fetched enrollments : ', enrollments)
            const course = enrollments.find((c) => String(c.courseId) === String(id));
            setCourseToStart(course)
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
    const handleSubmit = (selectedOpt, answer, mcqIndex) => {
        console.log('answer :', answer + " selected: ", selectedOpt + 'mcqindex : ',mcqIndex)
        // if (selectedOption !== null) {
        //     alert(`You selected: ${options[selectedOption]}`);
        // } else {
        //     alert("Please select an option.");
        // }
    }
    return (
        <>
            <Navbar />
            {courseToStart && (
                <div className="px-2 py-12 md:px-20">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">
                            {courseToStart.courseData.course_title}
                        </h1>
                    </div>
                </div>
            )}
            {courseToStart && (
                <div className="px-2 md:px-20 mx-auto flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-3/4 space-y-6">
                        {courseToStart?.courseData?.units?.length > 0 && (
                            <div className="py-4">
                                <div className="border rounded p-4 shadow-sm">
                                    <h2 className="text-xl font-semibold mb-2">
                                        {courseToStart.courseData.units[currentUnitIndex].unit_title}
                                    </h2>

                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Summary</h3>
                                    <p className="text-gray-600 mb-4">
                                        {courseToStart.courseData.units[currentUnitIndex].summary}
                                    </p>

                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">MCQs</h3>
                                    {courseToStart.courseData.units[currentUnitIndex].mcqs.map((mcq, mcqIndex) => (
                                        <div key={mcqIndex} className="mb-4 p-4 border rounded bg-gray-50">
                                            <div className="font-medium mb-2">{mcq.question}</div>
                                            <ul className="space-y-1">
                                                {mcq.options.map((opt, idx) => (
                                                    <li key={idx} className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={`mcq-${mcqIndex}`}
                                                            checked={selectedOption[mcqIndex]?.index === idx}
                                                            onChange={() => handleOptionChange(idx, opt, mcqIndex)}
                                                            className="mt-1 mr-3"
                                                        />
                                                        <span className="text-gray-700">{opt}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                onClick={() => handleSubmit(selectedOption[mcqIndex]?.text, mcq.answer, mcqIndex)}
                                                className="mt-6 px-5 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    ))}

                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Flashcards</h3>
                                    {courseToStart.courseData.units[currentUnitIndex].flashcards.length > 0 && (
                                        <div className="mb-4 p-4 border rounded bg-yellow-50">
                                            <div className="font-medium mb-2">
                                                {courseToStart.courseData.units[currentUnitIndex].flashcards[flashcardIndex].question}
                                            </div>
                                            <div className="text-gray-700 mb-2">
                                                {courseToStart.courseData.units[currentUnitIndex].flashcards[flashcardIndex].answer}
                                            </div>
                                            <button
                                                className="px-4 py-1 bg-yellow-600 text-white rounded"
                                                onClick={() =>
                                                    setFlashcardIndex((prev) =>
                                                        prev + 1 < courseToStart.courseData.units[currentUnitIndex].flashcards.length ? prev + 1 : 0
                                                    )
                                                }
                                            >
                                                Next Flashcard
                                            </button>
                                        </div>
                                    )}

                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">FAQs</h3>
                                    {courseToStart.courseData.units[currentUnitIndex].faqs.map((faq, index) => (
                                        <div key={index} className="mb-4 p-4 border rounded bg-gray-100">
                                            <div className="font-medium text-blue-900">{faq.question}</div>
                                            <div className="text-gray-700">{faq.answer}</div>
                                        </div>
                                    ))}

                                    <div className="flex justify-between mt-6">
                                        <button
                                            disabled={currentUnitIndex === 0}
                                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                                            onClick={() => {
                                                setCurrentUnitIndex((prev) => prev - 1);
                                                setFlashcardIndex(0);
                                            }}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            disabled={currentUnitIndex === courseToStart.courseData.units.length - 1}
                                            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                                            onClick={() => {
                                                setCurrentUnitIndex((prev) => prev + 1);
                                                setFlashcardIndex(0);
                                            }}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-1/4">
                        <h2 className="text-2xl py-4 font-semibold text-gray-800 mb-6">
                            Course Content
                        </h2>
                        <ul className="space-y-4">
                            {courseToStart.courseData.units.map((unit, index) => (
                                <li
                                    key={index}
                                    className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300"
                                >
                                    <button
                                        className="w-full text-left flex justify-between items-center p-5"
                                        onClick={() => toggleUnit(index)}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {unit.unit_title}
                                        </h3>
                                        {expandedIndex === index ? (
                                            <ChevronUp size={20} />
                                        ) : (
                                            <ChevronDown size={20} />
                                        )}
                                    </button>
                                    {expandedIndex === index && (
                                        <div className="px-5 pb-4 text-gray-600">
                                            <p>{unit.summary}</p>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    )
}
export default StartCourse
