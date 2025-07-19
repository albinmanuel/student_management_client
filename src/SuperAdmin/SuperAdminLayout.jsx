import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';

function SuperAdminLayout() {
  return (
    <div className="flex pt-16">
      <SuperAdminSidebar />
      <main className="flex-1 ml-64 p-4 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default SuperAdminLayout;
