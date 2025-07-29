import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios/axiosInstance.js';
import Navbar from '../components/Navbar.jsx';
import MethodCards from '../components/MethodCards.jsx';
import { ClipboardPaste, Upload } from "lucide-react";
import { useState } from 'react';
import UrlForm from '../components/UrlForm.jsx';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const [selectedMethod, setSelectedMethod] = useState()
    const navigate = useNavigate()
    const [showForm, setShowForm] = useState(false)


    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleForm = () => {
        setShowForm(prev => !prev)
    }


    return (
        <div>
            <Navbar />
            <h1 className='font-semibold text-3xl flex justify-center py-5' >Learning begins here.</h1>
            <div className="flex gap-4 flex-wrap justify-center items-center">
                <MethodCards icon={ClipboardPaste} method="Paste" options="YouTube Link" onClick={() => { setSelectedMethod('Paste'), toggleForm() }} />
                <MethodCards icon={Upload} method="Upload" options="File, Video, Audio" onClick={() => { setSelectedMethod('Upload'), toggleForm() }} />
            </div>

            {selectedMethod === 'Paste' && showForm && <UrlForm method={'Paste'} showForm={showForm} toggleForm={toggleForm} />}
            {selectedMethod === 'Upload' && showForm && <UrlForm method={'Upload'} showForm={showForm} toggleForm={toggleForm} />}
        </div>
    );
};

export default Dashboard;

// const fetchSecureData = async () => {
//     try {
//         const res = await axiosInstance.get('/secure');
//         alert("From backend: " + res.data.message);
//     } catch (err) {
//         alert('Unauthorized or server error');
//     }
// };