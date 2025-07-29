import { createContext, useContext, useState } from "react";


const ComponentContext = createContext()

export const useCompContext =  () => useContext(ComponentContext)

export const ComponentContextProvider = ({ children }) => {
    const [formData, setformData] = useState()
    const [courseData, setCourseData] = useState([])

    return (
        <ComponentContext.Provider value={{ formData, setformData, courseData, setCourseData }} >
            {children}
        </ComponentContext.Provider>
    )
}