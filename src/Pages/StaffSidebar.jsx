import React from 'react';
import { NavLink } from 'react-router-dom';

function StaffSidebar() {
  return (
    <aside className="w-64 bg-blue-500 text-white fixed top-16 left-0 bottom-0 z-40 overflow-y-auto">
      <div className="p-6 text-2xl font-bold border-b border-blue-700">
        Staff Panel
      </div>
      <nav className="flex flex-col gap-2 p-4">
        <NavLink
          to="/staff/dashboard"
          className={({ isActive }) =>
            isActive ? 'bg-blue-600 p-2 rounded' : 'p-2 hover:bg-blue-600 rounded'
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/staff/students"
          className={({ isActive }) =>
            isActive ? 'bg-blue-600 p-2 rounded' : 'p-2 hover:bg-blue-600 rounded'
          }
        >
          Manage Students
        </NavLink>
        <NavLink
          to="/staff/profile"
          className={({ isActive }) =>
            isActive ? 'bg-blue-600 p-2 rounded' : 'p-2 hover:bg-blue-600 rounded'
          }
        >
          Profile
        </NavLink>
      </nav>
    </aside>
  );
}

export default StaffSidebar;