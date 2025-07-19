import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createStudentByStaffAPI, 
  getAllStudentsByStaffAPI, 
  updateStudentByStaffAPI, 
  deleteStudentByStaffAPI 
} from '../../../Services/allAPI';

export const createStudentByStaff = createAsyncThunk(
  'staffStudents/createStudent',
  async ({ studentData, token }, { rejectWithValue }) => {
    try {
      const reqHeader = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const response = await createStudentByStaffAPI(studentData, reqHeader);
      
      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || 'Failed to create student');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Network error occurred'
      );
    }
  }
);

export const getAllStudentsByStaff = createAsyncThunk(
  'staffStudents/getAllStudents',
  async (token, { rejectWithValue }) => {
    try {
      const reqHeader = {
        'Authorization': `Bearer ${token}`
      };
      const response = await getAllStudentsByStaffAPI(reqHeader);
      
      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || 'Failed to fetch students');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Network error occurred'
      );
    }
  }
);

export const updateStudentByStaff = createAsyncThunk(
  'staffStudents/updateStudent',
  async ({ studentId, studentData, token }, { rejectWithValue }) => {
    try {
      const reqHeader = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const response = await updateStudentByStaffAPI(studentId, studentData, reqHeader);
      
      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || 'Failed to update student');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Network error occurred'
      );
    }
  }
);

export const deleteStudentByStaff = createAsyncThunk(
  'staffStudents/deleteStudent',
  async ({ studentId, token }, { rejectWithValue }) => {
    try {
      const reqHeader = {
        'Authorization': `Bearer ${token}`
      };
      const response = await deleteStudentByStaffAPI(studentId, reqHeader);
      
      if (response.status === 200) {
        return { studentId, message: response.data.message };
      } else {
        return rejectWithValue(response.data?.message || 'Failed to delete student');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Network error occurred'
      );
    }
  }
);

const staffStudentSlice = createSlice({
  name: 'staffStudents',
  initialState: {
    students: [],
    loading: false,
    error: null,
    successMessage: null,
    operationType: null, 
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearOperationType: (state) => {
      state.operationType = null;
    },
    resetState: (state) => {
      state.students = [];
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.operationType = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStudentByStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operationType = 'create';
      })
      .addCase(createStudentByStaff.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.student) {
          state.students.push(action.payload.student);
        }
        state.successMessage = action.payload.message || 'Student created successfully';
        state.operationType = 'create'; 
      })
      .addCase(createStudentByStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationType = null;
      })

      .addCase(getAllStudentsByStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operationType = 'fetch';
      })
      .addCase(getAllStudentsByStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
        state.operationType = null;
      })
      .addCase(getAllStudentsByStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationType = null;
      })

      .addCase(updateStudentByStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operationType = 'update';
      })
      .addCase(updateStudentByStaff.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex(
          student => student._id === action.payload.student._id
        );
        if (index !== -1) {
          state.students[index] = action.payload.student;
        }
        state.successMessage = action.payload.message || 'Student updated successfully';
        state.operationType = 'update';
      })
      .addCase(updateStudentByStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationType = null;
      })

      .addCase(deleteStudentByStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operationType = 'delete';
      })
      .addCase(deleteStudentByStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(
          student => student._id !== action.payload.studentId
        );
        state.successMessage = action.payload.message || 'Student deleted successfully';
        state.operationType = null;
      })
      .addCase(deleteStudentByStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationType = null;
      });
  },
});

export const { 
  clearError, 
  clearSuccessMessage, 
  clearMessages, 
  clearOperationType,
  resetState 
} = staffStudentSlice.actions;

export default staffStudentSlice.reducer;