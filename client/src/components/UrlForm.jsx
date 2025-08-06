import { useForm } from "react-hook-form";
import { useState } from "react";
import { X, Upload } from "lucide-react";
import axios from "axios";
import { useCourseContext } from "../context/CourseContext";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'
import { ClipLoader } from 'react-spinners';

const UrlForm = ({ showForm, toggleForm, method }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false)
    const { courses, setCourses } = useCourseContext()
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("Select Language");
    const navigate = useNavigate()

    const languages = ['English', 'Hindi', 'Chinese', 'French', 'German', 'Italian', 'Spanish'];

    function extractYouTubeThumbnail(url) {
        const videoIdMatch = url.match(/[?&]v=([^&#]*)|youtu\.be\/([^&#]*)|youtube\.com\/embed\/([^&#]*)/);
        const videoId = videoIdMatch ? (videoIdMatch[1] || videoIdMatch[2] || videoIdMatch[3]) : null;
        if (!videoId) return null;
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    const handleFormSubmit = async (data, e) => {
        setLoading(true)
        e.preventDefault()
        try {
            const { url, file, name, language } = data;
            console.log("Selected file:", file, 'and url : ', url);
            const id = uuidv4();
            let response;
            if (method === 'Paste') {
                response = await axios.post('http://localhost:8000/generate-course', { url, language });
                const course = response.data.course;
                const thumbnail = extractYouTubeThumbnail(url);
                console.log('extracted thumbnail : ', thumbnail)
                const courseId = uuidv4();
                const draftCourse = {
                    ...course,
                    courseId,
                    thumbnail,
                    createdAt: new Date().toISOString()
                };
                console.log('course to be stored as draft: ', draftCourse);
                localStorage.setItem("draftCourse", JSON.stringify(draftCourse));
                navigate(`/course/${id}`);
            } else if (method === 'Upload') {
                const formData = new FormData();
                const actualFile = file instanceof FileList ? file[0] : file;
                formData.append('file', actualFile);
                formData.append('language', language);
                formData.append('name', name);
                response = await axios.post('http://localhost:8000/generate-course-from-file', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
                const course = response.data.course;
                const thumbnail = 'https://cdn-icons-png.flaticon.com/512/337/337940.png';
                const courseId = uuidv4();
                const draftCourse = {
                    ...course,
                    courseId,
                    thumbnail,
                    createdAt: new Date().toISOString()
                };
                console.log('course to be stored : ', draftCourse);
                localStorage.setItem("draftCourse", JSON.stringify(draftCourse));
                navigate(`/course/${id}`);
            }
        } catch (error) {
            console.log('error submitting form : ', error);
        } finally {
            setLoading(false);
            toggleForm();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="w-full max-w-md p-6 rounded-xl bg-white shadow-lg">
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4"> {method === 'Paste' ? 'Paste YouTube Link' : 'Upload File'}</h2>
                    <X className="text-gray-700" onClick={toggleForm} />
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <ClipLoader color="#2563EB" size={80} />
                        </div>
                    ) : (
                        <>
                            {method === 'Paste' ? (
                                <>
                                    <input
                                        type="text"
                                        placeholder="https://www.youtube.com/watch?v=example"
                                        {...register("url", { required: "YouTube URL is required" })}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                                    {errors.url && (
                                        <p className="text-sm text-red-500">{errors.url.message}</p>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 w-full">
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition">
                                        <Upload />
                                        Upload File
                                    </label>

                                    <input
                                        id="file-upload"
                                        type="file"
                                        {...register('file', { required: "Please upload a file" })}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt" />

                                    {errors.file && (
                                        <p className="text-sm text-red-500">{errors.file.message}</p>
                                    )}
                                </div>
                            )}

                            <div className="relative w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {selected}
                                </button>

                                {isOpen && (
                                    <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                        {languages.map((lan, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    setSelected(lan);
                                                    setIsOpen(false);
                                                }}
                                                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                                            >
                                                {lan}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <p className="text-xs text-gray-500 mt-1">
                                    Course content will be translated to this language.
                                </p>
                            </div>
                        </>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-all">
                        {loading ? "Creating..." : "Create Course"}
                    </button>
                </form>
            </div >
        </div >
    );
};

export default UrlForm;
