import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async ({ email, password }) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const token = await auth.currentUser.getIdToken();
            localStorage.setItem('token', token);
            navigate('/dashboard');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                <div>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    />
                </div>

                <div>
                    <input
                        {...register("password")}
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
                >
                    Login
                </button>

                <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-purple-600 hover:underline cursor-pointer"
                    >
                        Register
                    </span>
                </p>
            </form>
        </div>
    );  

};

export default Login;
