import axiosInstance from "../axios/axiosInstance";


export const newEnrolment = (userId, course) => axiosInstance.post('/enrollments', { userId, course })
export const getEnrolments = (userId) => axiosInstance.get(`/enrollments/${userId}`)