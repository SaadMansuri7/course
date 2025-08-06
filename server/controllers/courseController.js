import { db } from "../firebaseAdmin.js"

export const addNewCourse = async (req, res) => {
    try {
        console.log(req.body)
        const docRef = await db.collection('courses').add(req.body)
        res.status(201).json({ message: 'course added', courseId: docRef.id })
        // console.log('ref : ', docRef.id)
    } catch (error) {
        console.log('error adding new course : ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getCourses = async (req, res) => {
    try {
        const snapshot = await db.collection('courses').get()
        const courses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        // console.log('data : ',courses)
        res.status(200).json(courses)
    } catch (error) {
        console.log('error adding new course : ', error)
        res.status(500).json({ error })
    }
}

export const updateCourseRating = async (req, res) => {
    try {
        const { userId, courseId, newRating, newRatingCount } = req.body;
        console.log('userid: ', userId, ' courseid : ', courseId, ' rating : ', newRating, ' count : ', newRatingCount)

        const snapshot = await db.collection('enrollments')
            .where("userId", "==", userId)
            .where("courseId", "==", courseId)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ error: "Enrollment not found" });
        }

        const enrollmentRef = snapshot.docs[0].ref;
        await enrollmentRef.update({
            "course.rating": newRating,
            "course.ratingCount": newRatingCount
        });

        // const updatedEnrollment = await enrollmentRef.get();
        // console.log("Updated enrollment:", updatedEnrollment.data());

        const coursesnapshot = await db.collection('courses')
            .where("courseId", "==", courseId)
            .get();

        if (coursesnapshot.empty) {
            return res.status(404).json({ error: "Course not found" });
        }

        const courseRef = coursesnapshot.docs[0].ref;

        await courseRef.update({
            rating: newRating,
            ratingCount: newRatingCount
        });

        const updatedCourse = await courseRef.get();
        console.log("Updated course:", updatedCourse.data());

        res.status(200).json({ message: 'Course rating updated successfully' });

    } catch (error) {
        console.log('Error updating course rating:', error);
        res.status(500).json({ error: error.message });
    }
};
