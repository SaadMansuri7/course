import { NavLink } from "react-router-dom";
import { UserCircle } from "lucide-react";

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">CourseGenie</span>

                <div className="flex items-center gap-8">
                    <ul className="flex gap-8 text-gray-700 font-medium">
                        <li>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-500"
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/mycourses"
                                className={({ isActive }) =>
                                    isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-500"
                                }
                            >
                                My Courses
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/explore"
                                className={({ isActive }) =>
                                    isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-500"
                                }
                            >
                                Explore
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/aboutus"
                                className={({ isActive }) =>
                                    isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-500"
                                }
                            >
                                About Us
                            </NavLink>
                        </li>
                    </ul>

                    <NavLink
                        to="/account"
                        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                        <UserCircle className="w-6 h-6 text-gray-600" />
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
