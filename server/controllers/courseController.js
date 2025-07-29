import { db } from "../firebaseAdmin.js"

export const addNewCourse = async(req, res) => {
    try {
        console.log(req.body)
        const docRef = await db.collection('courses').add(req.body)
        res.status(201).json({message: 'course added', courseId : docRef.id})
        console.log('ref : ',docRef.id)
    } catch (error) {
        console.log('error adding new course : ',error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getCourses = async(req, res) => {
    try {
        const snapshot = await db.collection('courses').get()
        const courses = snapshot.docs.map( (doc) => ({id: doc.id, ...doc.data() }) )
        // console.log('data : ',courses)
        res.status(200).json(courses)
    } catch (error) {
        console.log('error adding new course : ',error)
        res.status(500).json({ error: 'Internal server error' })
    }
}