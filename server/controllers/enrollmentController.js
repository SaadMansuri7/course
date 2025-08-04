import { db } from "../firebaseAdmin.js"


export const addNewEnrollment = async (req, res) => {
    try {
        const { userId, course } = req.body
        if (!course?.courseId) {
            return res.status(400).json({ error: "courseId is missing in course object" });
        }
        const enrollmentData = {
            userId,
            courseId: course.courseId,
            course,
            enrolledAt: new Date()
        }
        await db.collection('enrollments').add(enrollmentData)
        res.status(201).json({ message: "Enrollment successful" })
    } catch (error) {
        console.log('error adding new enrollment : ', error)
        res.status(500).json({ error })
    }
}

export const getAllEnrollments = async (req, res) => {
    try {
        const { userId } = req.params
        const querySnapshot = await db.collection('enrollments').where("userId", "==", userId).get()
        const enrollments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        res.status(200).json(enrollments)
    } catch (error) {
        console.log('error adding new enrollment : ', error)
        res.status(500).json({ error })
    }
}

// export const updateEnrollmentState = async (req, res) => {
//     try {
//         const { userId, courseId } = req.params
//         const { isCompleted, currentUnitIndex } = req.body
//         // console.log("Found enrollments:", querySnapshot.size);
//         console.log('userid: ', userId, ' courseId :', courseId, ' isCompleted: ', isCompleted, ' currentUnitIndex: ', currentUnitIndex)
//         const batch = db.batch()
//         const querySnapshot = await db.collection('enrollments').where("userId", "==", userId).where('courseId', '==', courseId).get()

//         querySnapshot.forEach((doc) => {
//             const existingUnits = doc.data().course.courseData?.units

//             if (!Array.isArray(existingUnits) || !existingUnits[currentUnitIndex]) {
//                 console.error("Invalid unit index or missing data.");
//                 return;
//             }

//             const updatedUnits = [...existingUnits]
//             updatedUnits[currentUnitIndex] = {
//                 ...updatedUnits[currentUnitIndex],
//                 isCompleted: isCompleted,
//             }
//             console.log('updated unit : ', updatedUnits)

//             try {
//                 const unitPath = `course.courseData.units.${currentUnitIndex}.isCompleted`;
//                 batch.update(doc.ref, { [unitPath]: isCompleted });
//             } catch (err) {
//                 console.log('Update failed for doc:', doc.id, err)
//             }

//         })
//         await batch.commit()
//         res.status(200).json({ message: "Enrollment updated successfully" })
//     } catch (error) {
//         console.log('error adding new enrollment : ', error)
//         res.status(500).json({ error })
//     }
// }

export const updateEnrollmentState = async (req, res) => {
    try {
        const { userId, courseId } = req.params
        const { isCompleted, currentUnitIndex } = req.body

        console.log('userid:', userId, 'courseId:', courseId, 'isCompleted:', isCompleted, 'currentUnitIndex:', currentUnitIndex)

        const batch = db.batch()
        const querySnapshot = await db.collection('enrollments')
            .where("userId", "==", userId)
            .where('courseId', '==', courseId)
            .get()

        if (querySnapshot.empty) {
            return res.status(404).json({ error: "Enrollment not found" })
        }

        querySnapshot.forEach((doc) => {
            const docData = doc.data()
            const existingUnits = docData.course?.courseData?.units

            // Validate that the unit index exists
            if (!Array.isArray(existingUnits) || !existingUnits[currentUnitIndex]) {
                console.error("Invalid unit index or missing data for doc:", doc.id)
                return
            }

            // Check if completedUnits already exists, if not create it
            const updateData = {}

            if (docData.completedUnits) {
                // completedUnits exists, just update the specific unit
                updateData[`completedUnits.${currentUnitIndex}`] = isCompleted
            } else {
                // completedUnits doesn't exist, create it with the current unit
                updateData.completedUnits = {
                    [currentUnitIndex]: isCompleted
                }
            }

            console.log('Updating with data:', updateData)
            batch.update(doc.ref, updateData)
        })

        await batch.commit()
        res.status(200).json({ message: "Enrollment updated successfully" })

    } catch (error) {
        console.error('Error updating enrollment:', error)
        res.status(500).json({ error: error.message })
    }
}