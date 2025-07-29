import { Router } from "express";
import { addNewEnrollment, getAllEnrollments } from "../controllers/enrollmentController.js";

const enrollmentRoute = Router()

enrollmentRoute.get('/:userId', getAllEnrollments)
enrollmentRoute.post('/', addNewEnrollment)

export default enrollmentRoute