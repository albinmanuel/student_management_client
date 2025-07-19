import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./Slice/authSlice"; 
import staffReducer from "./Slice/staffSlice";
import studentReducer from "./Slice/studentSlice"; 
import staffStudentReducer from './Slice/staffStudentSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    staff: staffReducer,
    students: studentReducer,
    staffStudents: staffStudentReducer
  },
});

export default store;