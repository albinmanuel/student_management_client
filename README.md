# Student Management System – Frontend

This is the frontend repository of the Student Management System built using React.js, Redux Toolkit, and Material-UI.

## Super Admin
- Email: admin@example.com
- Password : admin123

## Staff
- Email: staff@example.com
- Password: password

## 🛠 Technologies Used

- React.js
- Redux Toolkit
- React Router
- Material-UI (MUI)
- Axios
- sessionStorage for authentication session
- Role-based route protection


## 🚀 Features

- **Login System** (Super Admin and Staff)
- **JWT-based Authentication**
- **Route Protection** based on roles and permissions
- **Super Admin Dashboard**
  - View/Create/Edit/Delete Students
  - View/Create/Edit/Delete Staff
  - Assign student CRUD permissions to Staff
- **Staff Dashboard**
  - View profile
  - View students (CRUD actions depend on admin-granted permissions)
- **Responsive UI** built with MUI

## 🖥️ How to Run


```bash
git clone <https://github.com/albinmanuel/student_management_client.git>
cd std_mng_client
npm install
npm run dev

