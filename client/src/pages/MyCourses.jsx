import { useEffect } from "react"
import Navbar from "../components/Navbar"
import { auth } from "../firebase"
import { useCourseContext } from "../context/CourseContext"
import { getEnrolments } from "../services/enrollmentServices"
import EnrolledCoursesCard from "../components/EnrolledCourseCard"


const MyCourses = () => {

    const { enrLength, setEnrLength, isLoading, setIsLoading, enrolledCourses, setEnrolledCourses } = useCourseContext()


    useEffect(() => {
        async function fetchEnrollments() {
            setIsLoading(true)
            const userId = auth.currentUser.uid
            const res = await getEnrolments(userId)
            setEnrolledCourses(res.data)
            setEnrLength(res.data.length)
            setIsLoading(false)
        }
        fetchEnrollments()
    }, [enrLength])

    return (
        <>
            <Navbar />
            <div className="min-h-screen px-6 py-10">
                <h1 className="text-3xl font-bold text-start mb-10 text-gray-800 ">My Courses</h1>
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(enrLength)].map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-md border p-4 animate-pulse">
                                <div className="h-32 w-32 bg-gray-300 rounded mx-auto" />
                                <div className="mt-4 h-4 bg-gray-300 rounded w-3/4 mx-auto" />
                                <div className="mt-2 h-3 bg-gray-300 rounded w-1/2 mx-auto" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {enrolledCourses?.map((course, index) => (
                            <EnrolledCoursesCard key={index} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default MyCourses