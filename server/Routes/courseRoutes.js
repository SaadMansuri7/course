import { Router } from "express";
import { addNewCourse, getCourses } from "../controllers/courseController.js";

const courseRouter = Router()

courseRouter.get('/', getCourses)
courseRouter.post('/', addNewCourse)

export default courseRouter