import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { addNewCourse, getAllCourses } from "../services/courseServices.js"
import CourseCard from "../components/CourseCard.jsx"
import { useCourseContext } from "../context/CourseContext.jsx"


const Explore = () => {

    const { courses, setCourses, isLoading, setIsLoading, allLength, setAllLength } = useCourseContext()

    useEffect(() => {
        async function fetchCourses() {
            try {
                setIsLoading(true)
                const res = await getAllCourses()
                setCourses(res.data)
                setAllLength(res.data.length)
                setIsLoading(false)
                // console.log('fetched courses', res.data)
            } catch (error) {
                console.log('error fetching course : ', error)
            }
        }
        // addCourses()
        fetchCourses()
    }, [allLength])

    return (
        <>
            <Navbar />
            <div className="min-h-screen px-6 py-10">
                <h1 className="text-3xl font-bold text-start mb-10 text-gray-800 ">Explore Courses</h1>
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(allLength)].map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-md border p-4 animate-pulse">
                                <div className="h-32 w-32 bg-gray-300 rounded mx-auto" />
                                <div className="mt-4 h-4 bg-gray-300 rounded w-3/4 mx-auto" />
                                <div className="mt-2 h-3 bg-gray-300 rounded w-1/2 mx-auto" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {courses?.map((course, index) => (
                            <CourseCard key={index} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Explore