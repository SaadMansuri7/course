import { Star, StarHalf, StarOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EnrolledCoursesCard = ({ course }) => {
    const dummyRating = 4.5;
    const totalStars = 5;
    const navigate = useNavigate()

    const renderStars = () => {
        const filledStars = Math.floor(dummyRating);
        const hasHalfStar = dummyRating % 1 >= 0.5;
        const stars = [];
        for (let i = 0; i < filledStars; i++) {
            stars.push(<Star key={`star-${i}`} size={16} className="text-yellow-500 fill-yellow-500" />);
        }

        if (hasHalfStar) {
            stars.push(<StarHalf key="half" size={16} className="text-yellow-500 fill-yellow-500" />);
        }

        while (stars.length < totalStars) {
            stars.push(<StarOff key={`empty-${stars.length}`} size={16} className="text-gray-300" />);
        }

        return stars;
    };

    const handleNav = () => {
        navigate(`/course/${course.courseId}`)
        // console.log('id passed by enrolled page : ',course.courseId)
    }

    return (
        <div onClick={handleNav} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 p-4">
            <div className="flex justify-center">
                <img
                    src={course.courseData.thumbnail}
                    alt={course.courseData.course_title}
                    className="h-32 w-32 object-contain"
                />
            </div>
            <div className="mt-4 text-start">
                <h2 className="text-lg font-semibold text-gray-800">{course.courseData.course_title}</h2>
                <div className="flex flex-row justify-start text-sm text-gray-600 mt-1">
                    <p>Engineering</p>
                    <p className="ml-6">{course.courseData.units?.length || 0} Lessons</p>
                </div>
                <div className="flex items-center mt-2">
                    {renderStars()}
                    <span className="ml-2 text-sm text-gray-600">{dummyRating}</span>
                </div>
            </div>
        </div>
    );
};

export default EnrolledCoursesCard;
