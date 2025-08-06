import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import MethodCards from '../components/MethodCards.jsx';
import { ClipboardPaste, Upload } from "lucide-react";
import { useState, useEffect } from 'react';
import UrlForm from '../components/UrlForm.jsx';
import { auth } from "../firebase"
import { useCourseContext } from "../context/CourseContext"
import { getEnrolments } from "../services/enrollmentServices"
import EnrolledCoursesCard from "../components/EnrolledCourseCard"
import CourseCard from '../components/CourseCard.jsx';
import { getAllCourses } from '../services/courseServices.js';
const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const [selectedMethod, setSelectedMethod] = useState()
    const navigate = useNavigate()
    const [showForm, setShowForm] = useState(false)
    const { enrLength, setEnrLength, allLength, setAllLength, isLoading, setIsLoading, enrolledCourses, setEnrolledCourses, courses, setCourses } = useCourseContext()


    // const handleLogout = async () => {
    //     await logout();
    //     navigate('/login');
    // };

    const toggleForm = () => {
        setShowForm(prev => !prev)
    }

    useEffect(() => {
        async function fetchEnrollments() {
            const userId = auth.currentUser.uid
            const res = await getEnrolments(userId)
            setEnrolledCourses(res.data)
            setEnrLength(res.data.length)
        }
        fetchEnrollments()
    }, [enrLength])
    useEffect(() => {


        async function fetchCourses() {
            try {
                setIsLoading(true)
                const res = await getAllCourses()
                setCourses(res.data)
                setIsLoading(false)
                setAllLength(res.data.length)
                // console.log('fetched courses', res.data, ' and length : ', allLength)
            } catch (error) {
                console.log('error fetching course : ', error)
            }
        }
        fetchCourses()
    }, [allLength])


    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="min-w-[70%] mx-auto px-12 py-8">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                    Learning begins here.
                </h1>

                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    <MethodCards
                        icon={ClipboardPaste}
                        method="Paste"
                        options="YouTube Link"
                        onClick={() => {
                            setSelectedMethod("Paste");
                            toggleForm();
                        }}
                    />
                    <MethodCards
                        icon={Upload}
                        method="Upload"
                        options="File, Video, Audio"
                        onClick={() => {
                            setSelectedMethod("Upload");
                            toggleForm();
                        }}
                    />
                </div>

                <div className="mb-12">
                    {selectedMethod === "Paste" && showForm && (
                        <UrlForm method={"Paste"} showForm={showForm} toggleForm={toggleForm} />
                    )}
                    {selectedMethod === "Upload" && showForm && (
                        <UrlForm method={"Upload"} showForm={showForm} toggleForm={toggleForm} />
                    )}
                </div>

                <div className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-semibold text-gray-800">My Courses</h2>
                        <button
                            onClick={() => navigate("/mycourses")}
                            className="text-purple-600 hover:underline font-medium"
                        >
                            View More...
                        </button>
                    </div>

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
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {enrolledCourses?.map((course, index) => (
                                <div key={index} className="w-full h-full">
                                    <EnrolledCoursesCard course={course} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-semibold text-gray-800">Explore Courses</h2>
                        <button
                            onClick={() => navigate("/explore")}
                            className="text-purple-600 hover:underline font-medium"
                        >
                            View More...
                        </button>
                    </div>

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
                        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {courses?.map((course, index) => (
                                <CourseCard key={index} course={course} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default Dashboard;