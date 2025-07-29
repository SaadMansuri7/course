    import { useNavigate } from 'react-router-dom'
    import { authUse } from '../auth/authProvider.js'

    const navigate = useNavigate()

    const ProtectedRoute = ({ children }) => {
        const { currentUser } = authUse()
        return currentUser ? children : navigate('/login')
    } 

    export default ProtectedRoute