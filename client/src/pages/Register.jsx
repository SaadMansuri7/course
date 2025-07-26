import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async ({ email, password }) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

                <div>
                    <input
                        {...register("username")}
                        placeholder="Username"
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>

                <div>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>

                <div>
                    <input
                        {...register("password")}
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>

                <div>
                    <input
                        {...register("confirmPassword")}
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
                >
                    Register
                </button>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-purple-600 hover:underline cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );

};

export default Register;
