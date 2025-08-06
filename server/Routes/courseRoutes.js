import { Router } from "express";
import { addNewCourse, getCourses, updateCourseRating } from "../controllers/courseController.js";

const courseRouter = Router()

courseRouter.get('/', getCourses)
courseRouter.post('/', addNewCourse)
courseRouter.put('/:userId/:courseId/completed', updateCourseRating)

export default courseRouter