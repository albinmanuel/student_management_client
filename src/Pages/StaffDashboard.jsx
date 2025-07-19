import React, { useEffect, useState } from 'react';
import { getCountsAPI } from '../../Services/allAPI';

function StaffDashboard() {
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome {username}</h2>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="flex-1 bg-green-100 border-l-4 border-green-500 p-6 rounded shadow">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-green-900">{uscount.studentCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h4 className="text-xl font-semibold mb-4 text-gray-800">System Access</h4>
          <ul className="space-y-2 text-gray-600">
            <li>👤 You can view and manage your profile.</li>
            <li>🎓 You can view student records.</li>
            <li>⚙️ Management of student details is available only if enabled by Super Admin.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h4 className="text-xl font-semibold mb-4 text-gray-800">Reminders</h4>
          <ul className="space-y-2 text-gray-600">
            <li>📌 Keep your profile updated.</li>
            <li>🔒 Do not share login credentials.</li>
            <li>📅 Check student details regularly for accuracy.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
