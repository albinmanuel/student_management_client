import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './Components/Footer'
import Header from './Components/Header'
import Login from './Pages/Login'
import SuperAdminLayout from './SuperAdmin/SuperAdminLayout'
import SuperAdminDashboard from './SuperAdmin/SuperAdminDashboard'
import SuperAdminProfile from './SuperAdmin/SuperAdminProfile'
import ManageStudents from './SuperAdmin/ManageStudents'
import ManageStaff from './SuperAdmin/ManageStaff'
import StaffLayout from './Pages/StaffLayout'
import StaffDashboard from './Pages/StaffDashboard'
import StaffProfile from './Pages/StaffProfile'
import ViewStudents from './Pages/ViewStudents'
import ProtectedRoute from './Components/ProtectedRoute'

function App() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <div className="flex-1">
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path="/superadmin/*"element={
            <ProtectedRoute>
              <SuperAdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="profile" element={<SuperAdminProfile />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="staff" element={<ManageStaff />} />
          </Route>

          <Route path="/staff/*"  element={
            <ProtectedRoute>
              <StaffLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="profile" element={<StaffProfile />} />
            <Route path="students" element={<ViewStudents />} />
          </Route>
        </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App
