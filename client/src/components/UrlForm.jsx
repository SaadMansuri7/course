import { useForm } from "react-hook-form";
import { useState } from "react";
import { X, Upload } from "lucide-react";
import axios from "axios";

const UrlForm = ({ showForm, toggleForm, method }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const languages = ['English', 'Hindi', 'Chinese', 'French', 'German', 'Italian', 'Spanish'];

    const handleFormSubmit = async (data, e) => {
        setLoading(true)
        e.preventDefault()
        try {
            const { url, file, name, language } = data;
            console.log("Selected file:", file, 'and url : ', url)
            let response
            if (method === 'Paste') {
                response = await axios.post('http://localhost:8000/generate-course', { url,language })
            } else if (method === 'Upload') {
                const formData = new FormData()
                const actualFile = file instanceof FileList ? file[0] : file;
                formData.append('file', actualFile)
                response = await axios.post('http://localhost:8000/generate-course-from-file', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
            }
            console.log("Course generated:", response.data.course)
        } catch (error) {
            console.log('effor submitting form : ', error)
        } finally {
            setLoading(false)
            toggleForm()
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

                    <div>
                        {method === 'Paste' ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="https://www.youtube.com/watch?v=example"
                                    {...register("url", { required: "YouTube URL is required" })}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                                {errors.url && (
                                    <p className="text-sm text-red-500">{errors.url.message}</p>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-2 w-full">
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition"
                                    >
                                        <Upload />
                                        Upload File
                                    </label>

                                    <input
                                        id="file-upload"
                                        type="file"
                                        {...register('file', { required: "Please upload a file" })}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt"
                                    />

                                    {errors.file && (
                                        <p className="text-sm text-red-500">{errors.file.message}</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                        <input
                            type="text"
                            placeholder="Enter a descriptive name"
                            {...register("name", { required: "Course Name is required" })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <select
                            {...register("language")}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {languages.map((lan, index) => (
                                <option key={index} value={lan}>{lan}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Course content will be translated to this language.</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-all"
                    >
                        {loading ? "Creating..." : "Create Course"}
                    </button>
                </form>
            </div >
        </div >
    );
};

export default UrlForm;
