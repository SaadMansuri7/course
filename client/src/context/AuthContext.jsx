import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)
            if (user) {
                const token = await user.getIdToken()
                localStorage.setItem("token", token)
            } else {
                localStorage.removeItem("token")
            }
            setLoading(false)
        })
        return () => unsub()
    }, [])


    const logout = async () => {
        await signOut(auth)
        localStorage.removeItem('token');
    }

    return <AuthContext.Provider value={{ currentUser, logout }} >{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)