import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createStudentAPI, getAllStudentsAPI, updateStudentAPI, deleteStudentAPI } from '../../../Services/allAPI';

export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (reqBody, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = { 
        Authorization: `Bearer ${token}` 
      };
      const response = await createStudentAPI(reqBody, reqHeader);
      console.log('Create student response:', response.data);
      return response.data; 
    } catch (error) {
      console.error('Create student error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create student');
    }
  }
);

export const fetchAllStudents = createAsyncThunk(
  'students/fetchAllStudents',
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await getAllStudentsAPI(reqHeader);
      console.log('Fetch students response:', response.data);
      return response.data; 
    } catch (error) {
      console.error('Fetch students error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ studentId, reqBody }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = { 
        Authorization: `Bearer ${token}` 
      };
      const response = await updateStudentAPI(studentId, reqBody, reqHeader);
      console.log('Update student response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update student error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update student');
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await deleteStudentAPI(studentId, reqHeader);
      return { studentId, message: response.data.message };
    } catch (error) {
      console.error('Delete student error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete student');
    }
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    loading: false,
    error: null,
    success: false,
    selectedStudent: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetStudentState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const newStudent = action.payload.student || action.payload;
        state.students.push(newStudent);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      .addCase(fetchAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = Array.isArray(action.payload) ? action.payload : action.payload.students || [];
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedStudent = action.payload;
        const index = state.students.findIndex(student => student._id === updatedStudent._id);
        if (index !== -1) {
          state.students[index] = updatedStudent;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.students = state.students.filter(student => student._id !== action.payload.studentId);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { clearError, clearSuccess, resetStudentState, setSelectedStudent } = studentSlice.actions;
export default studentSlice.reducer;