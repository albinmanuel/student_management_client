import { Outlet } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';

function StaffLayout() {
  return (
    <div className="flex pt-16">
      <StaffSidebar />
      <main className="flex-1 ml-64 p-4 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default StaffLayout;
