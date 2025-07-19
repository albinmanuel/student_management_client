import React, { useEffect, useState } from 'react';
import { getCountsAPI } from '../../Services/allAPI';
import { Link } from 'react-router-dom';

function SuperAdminDashboard() {
  const [uscount, setCount] = useState({});
  const username = sessionStorage.getItem('username');

  useEffect(() => {
    const fetchCount = async () => {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await getCountsAPI(reqHeader);
        setCount(response.data);
      } catch (error) {
        console.error("Failed to fetch counts", error);
      }
    };

    fetchCount();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome {username}</h2>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="flex-1 bg-red-100 border-l-4 border-red-500 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Total Staffs</h3>
          <p className="text-3xl font-bold text-red-900">{uscount.staffCount}</p>
        </div>

        <div className="flex-1 bg-green-100 border-l-4 border-green-500 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-green-900">{uscount.studentCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h4 className="text-xl font-semibold mb-4 text-gray-800">System Overview</h4>
          <ul className="space-y-2 text-gray-600">
            <li>✔️ Staff and student records are maintained efficiently.</li>
            <li>📊 Admins have full access to all management tools.</li>
            <li>🛡️ Role-based permissions ensure secure access.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h4 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h4>
          <div className="flex flex-col gap-4">
           <Link to='/superadmin/staff' className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center">
              ➕ Add Staff
           </Link>
            <Link to='/superadmin/students' className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded text-center">
              ➕ Add Student
            </Link>
            <Link to='/superadmin/profile' className="bg-pink-500 hover:bg-pink-800 text-white font-semibold py-2 px-4 rounded text-center">
            👤 Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
