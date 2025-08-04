import axiosInstance from "../axios/axiosInstance";


export const newEnrolment = (userId, course) => axiosInstance.post('/enrollments', { userId, course })
export const updateEnrollmentState = (userId, courseId, isCompleted, currentUnitIndex) => axiosInstance.put(`/enrollments/${userId}/${courseId}`, { userId, courseId, isCompleted, currentUnitIndex })
export const getEnrolments = (userId) => axiosInstance.get(`/enrollments/${userId}`)
