import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios/axiosInstance.js';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const fetchSecureData = async () => {
        try {
            const res = await axiosInstance.get('/secure');
            alert("From backend: " + res.data.message);
        } catch (err) {
            alert('Unauthorized or server error');
        }
    };

    return (
        <div>
            <h2>Welcome, {currentUser?.email}</h2>
            <button onClick={fetchSecureData}>Call Secure API</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
