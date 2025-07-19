import React, { useEffect, useState } from 'react';
import { AccountCircle, Logout, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getParticularUserAPI } from '../../Services/allAPI'; 

function SuperAdminProfile() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await getParticularUserAPI(reqHeader);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
    window.location.reload()
  };

  return (
    <div className="relative min-h-screen p-6">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
        >
          <Logout className="mr-2" />
          Logout
        </button>
      </div>

      <div className="flex justify-center items-center h-full my-15">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <AccountCircle style={{ fontSize: 80 }} className="text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
          <p className="text-gray-600 mb-1">Email: {user.email}</p>
          <p className="text-gray-600 mb-1">Phone: {user.phoneno}</p>
          <p className="flex justify-center items-center text-gray-600">
            <Lock className="mr-2 text-gray-500" /> Password: ********
          </p>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminProfile;
