import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCourseContext } from "../context/CourseContext";
import { Star, StarHalf as EmptyStar } from "lucide-react";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "../components/Navbar";
import { getEnrolments, newEnrolment } from "../services/enrollmentServices";
import { auth } from "../firebase";
import { addNewCourse, getAllCourses } from "../services/courseServices";


const CourseDetails = () => {
    const { id } = useParams()
    const { courses, enrolledCourses, setEnrolledCourses, isEnrolled, setIsEnrolled, setCourses, courseToStart, setCourseToStart } = useCourseContext();
    const [expandedIndex, setExpandedIndex] = useState()
    const [isPublished, setIsPublished] = useState(false)
    const navigate = useNavigate()
    const username = auth.currentUser.displayName

    async function fetchEnrollments() {
        const courseRes = await getAllCourses()
        setCourses(courseRes.data)
        const userId = auth.currentUser.uid
        const res = await getEnrolments(userId)
        // console.log('fetched enrollments : ', res.data)
        setEnrolledCourses(res.data)
        const enrollments = res.data
        const course = courseRes.data.find((c) => String(c.id) === String(id));
        // console.log('course : ', course)
        const isAlreadyEnrolled = enrollments.some(enroll => enroll.courseId == course.id)
        setIsEnrolled(isAlreadyEnrolled)
    }

    async function getCoursesFromContext() {
        const draft = localStorage.getItem("draftCourse")
        if (draft) {
            setCourseToStart(JSON.parse(draft))
        }
    }

    useEffect(() => {
        // fetchEnrollments()
        getCoursesFromContext()
    }, [])

    const toggleUnit = (index) => {
        setExpandedIndex((prev) => (prev === index ? null : index))
    }

    if (!courseToStart) return <div>Loading...</div>

    const addtoDB = async () => {
        const draft = localStorage.getItem("draftCourse")
        const username = auth.currentUser.displayName
        const newCourse = {
            ...draft,
            instructor: username
        }
        await addNewCourse(newCourse)
        await getAllCourses()
        setIsPublished(true)
    }

    const handleStart = async () => {
        console.log('course id by course details :', id)
        const userId = auth.currentUser.uid
        const draft = localStorage.getItem("draftCourse")
        const enrolledCourses = await getEnrolments(userId)
        console.log('enrolled courses : ', enrolledCourses)
        const isAlreadyEnrolled = await enrolledCourses.data.find((course) => course.courseId === id)
        console.log('is already enrolled : ', isAlreadyEnrolled)

        if (!isAlreadyEnrolled) {
            await newEnrolment(userId, JSON.parse(draft))
            localStorage.removeItem("draftCourse")
            navigate(`/course/${id}/learn`)
        } else {
            navigate(`/course/${id}/learn`)
        }
    }

    const renderStars = () => {
        const stars = [];
        const totalStars = 5
        const rating = courseToStart?.rating
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

    return (
        courseToStart && (<>
            <Navbar />
            <div className="bg-blue-950 text-white px-6 py-12 md:px-20">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">{courseToStart?.course_title}</h1>
                    <p className="text-lg md:text-xl mb-6">Learn {courseToStart?.course_title?.split(" ")[0]} from top instructors.</p>
                </div>
            </div>

            <div className="relative z-20 py-8 px-4 md:px-20 -mt-24">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                        <div className="mt-6 space-y-4">
                            <p className="text-gray-700 text-lg">Instructor: <span className="font-semibold">{courseToStart?.instructor && username}</span></p>
                            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                                <button onClick={handleStart} className="text-blue-950 px-6 py-2 rounded-md border border-blue-950 font-medium hover:bg-blue-700 hover:text-white transition duration-200">Start Learning</button>
                                {
                                    isPublished &&
                                    <button onClick={addtoDB} className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-200">Publish Course</button>
                                }
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6 md:mt-0 text-sm text-center">
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <div className="flex items-center gap-x-1">
                                        {renderStars()}
                                    </div>
                                    <p className="font-bold text-lg">{courseToStart?.rating}</p>
                                </div>
                                <p className="text-gray-600">Ratings</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg">{courseToStart?.courseData?.units.length}</p>
                                <p className="text-gray-600">Lessons</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg">{courseToStart?.level}</p>
                                <p className="text-gray-600">Level</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg">~{courseToStart?.duration}</p>
                                <p className="text-gray-600">Duration</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl py-4 font-semibold text-gray-800 mb-6">Course Curriculum</h2>
                    <ul className="space-y-4">
                        {courseToStart?.courseData?.units.map((unit, index) => (
                            <li
                                key={index}
                                className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300"
                            >
                                <button
                                    className="w-full text-left flex justify-between items-center p-5"
                                    onClick={() => toggleUnit(index)}
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">{unit.unit_title}</h3>
                                    {expandedIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
        </>
        )
    );
};

export default CourseDetails;
