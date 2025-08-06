import axiosInstance from "../axios/axiosInstance";

export const addNewCourse = (data) => axiosInstance.post('/courses', data)
export const getAllCourses = () => axiosInstance.get('/courses')
export const updateCourseRating = (userId, courseId, newRating, newRatingCount) => axiosInstance.put(`/courses/${userId}/${courseId}/completed`, { userId, courseId, newRating, newRatingCount })