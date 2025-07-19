import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../Redux/Slice/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.warn('Please fill in all fields', {
        position: "top-center",
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

    const resultAction = await dispatch(loginUser(formData));
    if (loginUser.rejected.match(resultAction)) {
      toast.error('Invalid email or password', {
        position: "top-center",
        autoClose: 4000,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      toast.success(`Welcome ${currentUser.name}`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });

      setTimeout(() => {
        if (currentUser.role === 'superadmin') {
          navigate('/superadmin/dashboard');
        } else if (currentUser.role === 'staff') {
          navigate('/staff/dashboard');
        }
      }, 2000);
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-transform duration-500">
        
        <div className="md:w-1/2 hidden md:block">
          <img
            src="https://cdn.pixabay.com/photo/2016/11/19/21/01/analysis-1841158_1280.jpg"
            alt="Login Visual"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 bg-white flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-2">Login</h2>
          <p className="text-center text-sm text-gray-500 mb-8">Welcome back! Please enter your credentials.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="********"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
