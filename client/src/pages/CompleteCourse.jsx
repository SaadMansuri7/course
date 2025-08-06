import { useEffect, useState } from "react"
import { useCourseContext } from "../context/CourseContext"
import { Star, StarHalf, StarOff } from "lucide-react";
import { useParams } from "react-router-dom";
import { getAllCourses } from "../services/courseServices";
import { getEnrolments } from "../services/enrollmentServices";
import { auth } from "../firebase";
import { updateCourseRating } from "../services/courseServices";
import Navbar from "../components/Navbar";

const CompleteCourse = () => {

    const { id } = useParams()
    const { isLoading, setIsLoading, enrolledCourses, setEnrolledCourses, courses, setCourses } = useCourseContext()
    const [hovered, setHovered] = useState(0)
    const [currentRating, setCurrentRating] = useState(0)
    const [ratingStar, setRatingStar] = useState(0)
    const [currentRatingCount, setCurrentRatingCount] = useState(0)

    async function fetchEnrollments() {
        setIsLoading(true)
        const userId = auth.currentUser.uid
        const res = await getEnrolments(userId)
        setEnrolledCourses(res.data)
        setIsLoading(false)
        // console.log('courses', res.data)
    }

    async function fetchCourses() {
        try {
            setIsLoading(true)
            const res = await getAllCourses()
            setCourses(res.data)
            setIsLoading(false)
            // console.log('courses', res.data)
        } catch (error) {
            console.log('error fetching course : ', error)
        }
    }

    useEffect(() => {
        fetchEnrollments()
        fetchCourses()
    }, [])

    useEffect(() => {
        if (enrolledCourses) {
            const course = enrolledCourses.find((c) => c.courseId == String(id))
            setCurrentRating(course.course.rating)
            setCurrentRatingCount(course.course.ratingCount)
            // console.log('course : ', course, ' and rating : ', currentRating)
        }
    }, [enrolledCourses])


    useEffect(() => {
        console.log('from effect')
        console.log('course id : ', id)
        console.log("User rating:", ratingStar);
        console.log("Updated course rating:", currentRating);
        console.log("Total Ratings count:", currentRatingCount)
    }, [currentRating, currentRatingCount])


    const updateRating = async (newRating) => {
        const userId = auth.currentUser.uid
        const newCount = currentRatingCount + 1;
        const updatedRating = ((currentRating * currentRatingCount) + newRating) / newCount;

        setCurrentRating(updatedRating);
        setCurrentRatingCount(newCount);
        setRatingStar(newRating);

        await updateCourseRating(userId, id, updatedRating, newCount)
    };

    const displayRating = hovered || ratingStar || currentRating;
    return (
        <>
            <Navbar/>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Rate this Course</h2>

                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => {
                            let icon;
                            if (displayRating >= star) {
                                icon = <Star className="text-yellow-400 fill-yellow-400 w-8 h-8" />;
                            } else if (displayRating >= star - 0.5) {
                                icon = <StarHalf className="text-yellow-400 fill-yellow-400 w-8 h-8" />;
                            } else {
                                icon = <Star className="text-gray-300 w-8 h-8" />;
                            }

                            return (
                                <span
                                    key={star}
                                    className="cursor-pointer transition-transform transform hover:scale-125"
                                    onClick={() => {
                                        setRatingStar(star);
                                        updateRating(star);
                                    }}
                                    onDoubleClick={() => {
                                        setRatingStar(star - 0.5);
                                        updateRating(star - 0.5);
                                    }}
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                >
                                    {icon}
                                </span>
                            );
                        })}
                    </div>

                    <p className="text-sm text-gray-500 mb-2">Click to rate, double-click for half-star!</p>
                    {currentRating > 0 && (
                        <p className="text-green-600 font-medium">
                            Thank you! You rated this course {currentRating} star{currentRating > 1 ? 's' : ''}.
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}

export default CompleteCourse