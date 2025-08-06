import { Star, StarHalf, StarOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EnrolledCoursesCard = ({ course }) => {
    const courseToShow = course.course
    const navigate = useNavigate()
    // console.log('course passed: ',course)
    // console.log('enrolled course :', course.course)

    const renderStars = () => {
        const stars = [];
        const totalStars = 5
        const rating = courseToShow.rating
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


    const handleNav = () => {
        console.log('id passed by enrolled page : ', course.courseId)
        navigate(`/course/${course.courseId}`)
    }

    return (
        <div onClick={handleNav} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 p-4">
            <div className="flex justify-center">
                <img
                    src={courseToShow.thumbnail}
                    alt={courseToShow.course_title}
                    className="w-full object-contain h-auto max-w-md"
                />
            </div>
            <div className="mt-4 text-start">
                <h2 className="text-lg font-semibold text-gray-800">{courseToShow.course_title}</h2>
                <div className="flex flex-row justify-start text-sm text-gray-600 mt-1">
                    <p>{courseToShow.instructor || 'user85952'}</p>
                    <p className="ml-6">{courseToShow.courseData?.units?.length || 0} Lessons</p>
                </div>
                <div className="flex items-center mt-2">
                    {renderStars()}
                    <span className="ml-2 text-sm text-gray-600">{courseToShow.rating}</span>
                </div>
            </div>
        </div>
    );
};

export default EnrolledCoursesCard;
