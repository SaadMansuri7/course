import { useEffect } from "react"
import Navbar from "../components/Navbar"
import { auth } from "../firebase"
import { useCourseContext } from "../context/CourseContext"
import { getEnrolments } from "../services/enrollmentServices"
import EnrolledCoursesCard from "../components/EnrolledCourseCard"


const MyCourses = () => {

    const { enrolledCourses, setEnrolledCourses, } = useCourseContext()

    useEffect(() => {
        async function fetchEnrollments() {
            const userId = auth.currentUser.uid
            const res = await getEnrolments(userId)
            setEnrolledCourses(res.data)
        }
        fetchEnrollments()
    }, [])

    return (
        <>
            <Navbar />
            <div className="min-h-screen px-6 py-10">
                <h1 className="text-3xl font-bold text-start mb-10 text-gray-800 ">Explore Courses</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {enrolledCourses?.map((course, index) => (
                        <EnrolledCoursesCard key={index} course={course} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default MyCourses