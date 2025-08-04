import { Router } from "express";
import { addNewEnrollment, getAllEnrollments, updateEnrollmentState } from "../controllers/enrollmentController.js";

const enrollmentRoute = Router()

enrollmentRoute.get('/:userId', getAllEnrollments)
enrollmentRoute.post('/', addNewEnrollment)
enrollmentRoute.put('/:userId/:courseId', updateEnrollmentState)

export default enrollmentRoute