import { db } from "../firebaseAdmin.js"


export const addNewEnrollment = async (req, res) => {
    try {
        const { userId, course } = req.body
        const progress = {}
        course.units.forEach(unit => {
            progress[unit.unit_title] = { complete: false }
        })
        const enrollmentData = {
            userId,
            courseId: course.id,
            courseData: course,
            progress,
            enrolledAt: new Date()
        }
        await db.collection('enrollments').add(enrollmentData)
        res.status(201).json({ message: "Enrollment successful"})
    } catch (error) {
        console.log('error adding new enrollment : ', error)
        res.status(500).json({ error })
    }
}

export const getAllEnrollments = async (req, res) => {
    try {
        const { userId } = req.params
        const querySnapshot = await db.collection('enrollments').where("userId", "==", userId).get()
        const enrollments = querySnapshot.docs.map( (doc) => ({id: doc.id, ...doc.data() }) )
        res.status(200).json(enrollments)
    } catch (error) {
        console.log('error adding new enrollment : ', error)
        res.status(500).json({ error })
    }
}