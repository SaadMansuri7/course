import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext.jsx';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses.jsx';
import Explore from './pages/Explore.jsx';
import About from './pages/AboutUs.jsx';
import Account from './pages/Account.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import { CourseProvider } from './context/CourseContext.jsx';
import StartCourse from './pages/StartCourse.jsx';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <CourseProvider >
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/mycourses" element={<MyCourses />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/account" element={<Account />} />
            <Route path={`/course/:id`} element={<CourseDetails />} />
            <Route path={`/course/:id/learn`} element={<StartCourse />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
