import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { addNewCourse, getAllCourses } from "../services/courseServices.js"
import CourseCard from "../components/CourseCard.jsx"
import { useCourseContext } from "../context/CourseContext.jsx"


const Explore = () => {

    const { courses, setCourses } = useCourseContext()

    useEffect(() => {
        // async function addCourses() {
        //     try {
        //         for (const course of courseData) {
        //             await addNewCourse(course)
        //         }    
        //     } catch (error) {
        //         console.error("Error storing course:", error);
        //     }
        // }

        async function fetchCourses() {
            try {

                const res = await getAllCourses()
                setCourses(res.data)
                // console.log('fetched courses', res.data)
            } catch (error) {

            }
        }
        // addCourses()
        fetchCourses()
    }, [])


    return (
        <>
            <Navbar />
            <div className="min-h-screen px-6 py-10">
                <h1 className="text-3xl font-bold text-start mb-10 text-gray-800 ">Explore Courses</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {courses?.map((course, index) => (
                        <CourseCard key={index} course={course} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Explore
// const courseData = [
//     {
//         "course_title": "React.js Fundamentals",
//         "thumbnail": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.achieversit.com%2Freact-training-training-course-institute-in-bangalore&psig=AOvVaw1fxtlIUtfVgSMGE3xy_kNO&ust=1753781185683000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNirsZ6e344DFQAAAAAdAAAAABAE",
//         "units": [
//             {
//                 "unit_title": "Introduction to React & JSX",
//                 "summary": "React is a JavaScript library for building UI in a declarative, component‑based way. JSX is a syntax extension that lets you write HTML‑like code inside JavaScript, making UI structures more readable. In this unit you’ll set up your first React app, explore the role of components, and understand the rendering flow. By the end, you'll grasp how React’s virtual DOM improves performance and how JSX simplifies UI development.\n\nYou’ll also get hands‑on with your first component: learning to define it as a function, return JSX, and render it to the screen. We cover writing and structuring JSX properly, conditional rendering, and how React ensures clean updates to your UI without full page refreshes.",
//                 "flashcards": [
//                     {
//                         "question": "What is JSX in React?",
//                         "answer": "JSX is a syntax extension that looks like HTML but lives in JavaScript and describes the UI structure."
//                     },
//                     {
//                         "question": "Why does React use a virtual DOM?",
//                         "answer": "To efficiently update the real DOM by minimizing direct manipulations and improving performance."
//                     }
//                 ],
//                 "mcqs": [
//                     {
//                         "question": "Which of the following is valid JSX syntax?",
//                         "options": ["<div>Hello</div>", "div>Hello</div>", "{div}Hello", "createElement(div,…)"],
//                         "answer": "<div>Hello</div>"
//                     }
//                 ],
//                 "faqs": [
//                     {
//                         "question": "Do you need JSX to use React?",
//                         "answer": "No, but JSX makes code more readable. You can write React without it using React.createElement directly."
//                     }
//                 ]
//             },
//             {
//                 "unit_title": "State, Props and Component Hierarchy",
//                 "summary": "This unit dives deeper into how components communicate via props and manage internal state. Props let parents pass data down, while state lets components hold and update their own data over time. You’ll learn how state changes trigger re‑renders and how to lift state up to share among siblings.\n\nWe’ll also explore component hierarchy: how nesting works, how prop drilling can become cumbersome, and strategies like composition and context API to organize clean, maintainable projects.",
//                 "flashcards": [
//                     {
//                         "question": "What is the difference between state and props?",
//                         "answer": "State is internal and mutable within a component, while props are external values passed by parent components and are read‑only."
//                     },
//                     {
//                         "question": "What does “lifting state up” mean?",
//                         "answer": "Moving shared state to a common parent so multiple components can access and modify it."
//                     }
//                 ],
//                 "mcqs": [
//                     {
//                         "question": "Which hook is used to add state in a functional component?",
//                         "options": ["useState()", "useEffect()", "useContext()", "useReducer()"],
//                         "answer": "useState()"
//                     }
//                 ],
//                 "faqs": [
//                     {
//                         "question": "Can a child component modify props it receives?",
//                         "answer": "No, props are immutable. To change data, the parent must update props or pass callbacks."
//                     }
//                 ]
//             },
//             {
//                 "unit_title": "Event Handling & Lifecycle",
//                 "summary": "Here you’ll master React event handling: setting up click handlers, working with controlled inputs, and managing form submission. We’ll compare the old `bind()` approach in class components with arrow functions in functional ones. After that, dive into component lifecycle: mounting, updating, and unmounting phases inside class components, and compare to useEffect in hooks-based components.\n\nFinally, you'll practice cleaning up side‑effects (like subscriptions or timers) to prevent memory leaks and unexpected behavior. Understanding these lifecycles gives you control over React’s rendering process.",
//                 "flashcards": [
//                     {
//                         "question": "What method handles cleanup in useEffect?",
//                         "answer": "The function returned from useEffect runs when the component unmounts or dependencies change."
//                     },
//                     {
//                         "question": "How do you attach an event handler in JSX?",
//                         "answer": "Use camelCase syntax, e.g., `<button onClick={handleClick}>`."
//                     }
//                 ],
//                 "mcqs": [
//                     {
//                         "question": "Which lifecycle method runs after the component outputs to the DOM?",
//                         "options": ["componentDidMount", "componentWillMount", "render", "componentDidUpdate"],
//                         "answer": "componentDidMount"
//                     }
//                 ],
//                 "faqs": [
//                     {
//                         "question": "When should you use useEffect with an empty dependency array?",
//                         "answer": "To run code only once after initial render—like fetching data or setting up subscriptions."
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         "course_title": "Build REST APIs with Node.js and Express",
//         "thumbnail": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.mbloging.com%2Fpost%2Flearn-how-to-build-a-restful-api-with-express-js-and-mongodb&psig=AOvVaw2kfEnj-hDpV4niEnzwHMuw&ust=1753781251289000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNir2rqe344DFQAAAAAdAAAAABAK",
//         "units": [
//             {
//                 "unit_title": "Project Setup & Middleware Basics",
//                 "summary": "Start by installing Node.js and initializing a project with `npm init`. You’ll install Express, set up a simple server, define routes, and learn about middleware—functions that intercept requests for tasks like logging, authentication, or JSON parsing. By unit-end you have a working server able to respond to basic GET and POST endpoints.\n\nUnderstanding middleware flow is essential: order matters. You’ll see how Express processes requests through middleware stack before reaching final route handlers, and how to manage errors using error-handling middleware.",
//                 "flashcards": [
//                     {
//                         "question": "How do you parse JSON request bodies in Express?",
//                         "answer": "By using `express.json()` middleware."
//                     },
//                     {
//                         "question": "What is middleware in Express?",
//                         "answer": "A function that runs between receiving a request and sending a response, often for preprocessing."
//                     }
//                 ],
//                 "mcqs": [
//                     {
//                         "question": "Which command generates a package.json automatically?",
//                         "options": ["npm init", "npm start", "npm run", "npm init -y"],
//                         "answer": "npm init -y"
//                     }
//                 ],
//                 "faqs": [
//                     {
//                         "question": "Why is middleware order important in Express?",
//                         "answer": "Because Express executes them in sequence—placing logging after routing won’t log route hits."
//                     }
//                 ]
//             },
//             {
//                 "unit_title": "CRUD APIs & Route Parameters",
//                 "summary": "This unit focuses on RESTful API design: creating endpoints to handle Create (POST), Read (GET), Update (PUT/PATCH), and Delete (DELETE) operations. You’ll practice parsing route parameters (`/users/:id`) and query params, validating inputs, and returning correct HTTP status codes.\n\nYou'll build controllers to manage database actions (mock or real DB) and structure error handling for edge cases like missing data or invalid IDs.",
//                 "flashcards": [
//                     {
//                         "question": "Which HTTP method is conventionally used to delete a resource?",
//                         "answer": "DELETE"
//                     },
//                     {
//                         "question": "What status code is returned after successful resource update?",
//                         "answer": "200 or 204 with no content"
//                     }
//                 ],
//                 "mcqs": [
//                     {
//                         "question": "Which method handles route parameters in Express?",
//                         "options": ["req.params", "req.body", "req.query", "req.route"],
//                         "answer": "req.params"
//                     }
//                 ],
//                 "faqs": [
//                     {
//                         "question": "How do you send a 404 error if a resource isn't found?",
//                         "answer": "Use `res.status(404).json({ error: 'Not Found' })` or throw appropriate middleware error."
//                     }
//                 ]
//             },
//             {
//                 "unit_title": "Connecting to MongoDB & Authentication",
//                 "summary": "Here you'll integrate MongoDB using Mongoose, define schemas and models, and perform database operations. Then you'll implement authentication using JWT: users sign up or log in, receive a token, and include it in headers for protected routes. We cover password hashing, token verification, and secure route protection.\n\nYou’ll also learn error handling for auth flows—expired tokens, incorrect credentials—and how to test secured endpoints via tools like Postman or Insomnia.",
//                 "flashcards": [
//                     {
//                         "question": "What does JWT stand for?",
//                         "answer": "JSON Web Token."
//                     },
//                     {
//                         "question": "What library is commonly used to define schemas in Node.js?",
//                         "answer": "Mongoose."
//                     }
//                 ],
//                 "mcqs": [
//                     {
//                         "question": "Which package hashes passwords in Node.js?",
//                         "options": ["bcrypt", "express"],
//                         "answer": "bcrypt"
//                     }
//                 ],
//                 "faqs": [
//                     {
//                         "question": "How do you verify a JWT in Express middleware?",
//                         "answer": "Use a library like `jsonwebtoken` to decode token and verify signature before granting access."
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         "course_title": "Full-Stack Development with Firebase & React",
//         "thumbnail": "https://www.google.com/url?sa=i&url=http%3A%2F%2Finnovance.com.tr%2Fhow-to-connect-firebase-realtime-database-to-a-react-app%2F&psig=AOvVaw3Cc2sBLusZHFTUoazo7ckD&ust=1753781317920000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKj7uNqe344DFQAAAAAdAAAAABAE",
//         "units": [
//             {
//                 "unit_title": "Firebase Overview & Project Setup",
//                 "summary": "Get introduced to Firebase’s suite: Authentication, Firestore, and Hosting. You’ll create a Firebase project, add a web app, set up API keys, and initialize SDK in a React project. Understand security rules and project structure before writing any code.\n\nYou’ll set up email/password auth, sign users in, and explore Firebase console insights like usage stats and authentication logs. By the end, you’ll have a functioning Firebase project connected to your React frontend.",
//                 "flashcards": [
//                     {
//                         "question": "What Firebase services are covered in this unit?",
//                         "answer": "Authentication, Firestore, and Hosting."
//                     },
//                     {
//                         "question": "Where do you manage Firebase project settings?",
//                         "answer": "In the Firebase Console online."
//                     }
//                 ],
//                 "mcqs": [
//                     {
//                         "question": "Which file contains Firebase config in React?",
//                         "options": ["firebase.js", "config.json", "index.js", "firebase.ts"],
//                         "answer": "firebase.js"
//                     }
//                 ],
//                 "faqs": [
//                     {
//                         "question": "Do you need a backend server for Firebase usage?",
//                         "answer": "Not for basic CRUD and auth—it provides a no‑server backend."
//                     }
//                 ]
//             },
//             {
//                 "unit_title": "CRUD with Firestore",
//                 "summary": "Learn to connect React to Firestore to perform CRUD operations. You’ll write functions to add, retrieve, update, and delete documents from your Firestore collections using Firebase SDK. We cover real‑time data updates with `onSnapshot` and handling loading states and errors on the UI.\n\nYou’ll also implement offline persistence so users can interact even without internet. You’ll test operations live on Firebase console and verify real‑time sync across devices.",
//                 "flashcards": [
//                     {
//                         "question": "Which method adds a document to Firestore?",
//                         "answer": "collection().add({...})"
//                     },
//                     {
//                         "question": "What does onSnapshot() do?",
//                         "answer": "Provides real‑time updates when Firestore data changes."
//                     }
//                 ],
//                 "mcqs": [
//                     {
//                         "question": "Which Firestore method updates a document?",
//                         "options": ["set()", "update()", "push()", "modify()"],
//                         "answer": "update()"
//                     }
//                 ],
//                 "faqs": [
//                     {
//                         "question": "Does Firestore cache data locally automatically?",
//                         "answer": "Yes—if enabled, it syncs when the network reconnects."
//                     }
//                 ]
//             },
//             {
//                 "unit_title": "Authentication, Hosting & Deployment",
//                 "summary": "This final unit shows how to implement email/password login and sign‑up using Firebase Auth, including verifying email, reset flow, and handling errors. Next, you’ll deploy your React app to Firebase Hosting with `firebase deploy` and set up security rules. We address browser routing and custom domains.\n\nBy the end, you'll have a live, secure full‑stack Firebase app—complete with authentication, real‑time database interactions, and static site hosting. You’ll also learn how to monitor and manage your deployment via the Firebase CLI and console tools.",
//                 "flashcards": [
//                     {
//                         "question": "How do you deploy a React app to Firebase Hosting?",
//                         "answer": "Install Firebase CLI and run `firebase deploy`."
//                     },
//                     {
//                         "question": "What can Firebase Security Rules control?",
//                         "answer": "They define who can read/write data and under what conditions."
//                     }
//                 ],
//                 "mcqs": [
//                     {
//                         "question": "Which file is used to configure Firebase Hosting rules?",
//                         "options": ["firestore.rules", "firebase.json", "hosting.config", "index.html"],
//                         "answer": "firebase.json"
//                     }
//                 ],
//                 "faqs": [
//                     {
//                         "question": "Do you need to purchase hosting separately?",
//                         "answer": "No—Firebase Hosting provides free tier hosting with SSL for verified domains."
//                     }
//                 ]
//             }
//         ]
//     }
// ]