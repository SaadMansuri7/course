import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import { useCourseContext } from "../context/CourseContext";
import { useState, useEffect } from "react";
import { getEnrolments } from "../services/enrollmentServices";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuth } from '../context/AuthContext.jsx'

const Account = () => {
    const user = auth.currentUser;
    const navigate = useNavigate();
    const { enrolledCourses, setEnrolledCourses } = useCourseContext();
    const [completedCourseCount, setCompletedCourseCount] = useState(0)

    const [profileImage, setProfileImage] = useState("https://ui-avatars.com/api/?name=User");

    useEffect(() => {
        async function fetchEnrollments() {
            const userId = user?.uid;
            if (userId) {
                const res = await getEnrolments(userId);
                const enrollments = res.data
                console.log('enrollments :', enrollments)
                const enrollmentsWithProgress = enrollments.map((enrollment) => {
                    const totalUnits = enrollment.course?.courseData?.units?.length || 0;
                    const completedCount = Object.keys(enrollment?.completedUnits ?? {}).length;
                    const progress = totalUnits > 0 ? (completedCount / totalUnits) * 100 : 0;
                    const isCompleted = totalUnits > 0 && totalUnits === completedCount;

                    return {
                        ...enrollment,
                        progress,
                        completedCount,
                        totalUnits,
                        isCompleted
                    }
                })
                setEnrolledCourses(enrollmentsWithProgress);
                const completedCount = enrollmentsWithProgress.filter(e => e.isCompleted).length
                setCompletedCourseCount(completedCount)
            }
        }
        fetchEnrollments();
    }, []);
    // useEffect(() => {
    //     console.log('Updated enrolledCourses:', enrolledCourses);
    // }, [enrolledCourses]);


    const handleLogout = async () => {
        await signOut(auth)
        localStorage.removeItem('token');
        navigate("/login");
    };

    const joinedDate = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString()
        : "N/A";


    return (
        <>
            <Navbar />
            <div className="min-h-screen py-10 px-4">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                        />
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-semibold text-gray-800">{user?.displayName || "User"}</h2>
                            <p className="text-gray-600">{user?.email}</p>
                            <p className="text-gray-500 text-sm">Joined on: {joinedDate}</p>
                        </div>
                        <div className="sm:ml-auto">
                            <button
                                onClick={handleLogout}
                                className="mt-4 sm:mt-0 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        <div className="bg-purple-100 p-5 rounded-lg text-center">
                            <p className="text-sm text-gray-600">Enrolled Courses</p>
                            <h3 className="text-2xl font-bold text-purple-700">{enrolledCourses?.length || 0}</h3>
                        </div>
                        <div className="bg-green-100 p-5 rounded-lg text-center">
                            <p className="text-sm text-gray-600">Completed Courses</p>
                            <h3 className="text-2xl font-bold text-green-700">{completedCourseCount}</h3>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Progress</h3>
                        {enrolledCourses && enrolledCourses.length > 0 ? (
                            enrolledCourses.map((course, index) => (
                                <div key={index} className="mb-6">
                                    <p className="text-lg font-medium text-gray-700 mb-1">
                                        {course.course.course_title}
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${Math.floor(course.progress)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No enrolled courses yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Account;
