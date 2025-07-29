import axiosInstance from "../axios/axiosInstance";

export const addNewCourse = (data) => axiosInstance.post('/courses',data)
export const getAllCourses = () => axiosInstance.get('/courses')