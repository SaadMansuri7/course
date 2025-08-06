import { createContext, useContext, useEffect, useState } from "react";
import { getAllCourses } from "../services/courseServices";

const CourseContext = createContext()

export const useCourseContext = () => useContext(CourseContext)

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState([])
    const [enrolledCourses, setEnrolledCourses] = useState()
    const [isEnrolled, setIsEnrolled] = useState(null)
    const [courseToStart, setCourseToStart] = useState()
    const [currentUnitIndex, setCurrentUnitIndex] = useState(0)
    const [flashcardIndex, setFlashcardIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [allLength, setAllLength] = useState(0)
    const [enrLength, setEnrLength] = useState(0)

    return (
        <CourseContext.Provider value={{ enrLength, setEnrLength, allLength, setAllLength, isLoading, setIsLoading, courseToStart, setCourseToStart, courses, setCourses, enrolledCourses, setEnrolledCourses, isEnrolled, setIsEnrolled, currentUnitIndex, setCurrentUnitIndex, flashcardIndex, setFlashcardIndex }}>
            {children}
        </CourseContext.Provider>
    )
}



// useEffect(() => {

//     async function fetchCourses() {
//         try {

//             const res = await getAllCourses()
//             setCourses(res.data)
//             console.log('fetched courses', res.data)
//         } catch (error) {

//         }
//     }
//     fetchCourses()
// }, [])