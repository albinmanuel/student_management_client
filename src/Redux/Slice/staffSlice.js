import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createStaffAPI, 
  getAllStaffsAPI, 
  updateStaffAPI, 
  deleteStaffAPI, 
  updatePermissionsAPI, 
  getPermissionsAPI 
} from '../../../Services/allAPI';

export const createStaff = createAsyncThunk(
  'staff/createStaff',
  async (reqBody, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await createStaffAPI(reqBody, reqHeader);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create staff');
    }
  }
);

export const getAllStaffs = createAsyncThunk(
  'staff/getAllStaffs',
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await getAllStaffsAPI(reqHeader);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch staffs');
    }
  }
);

export const updateStaff = createAsyncThunk(
  'staff/updateStaff',
  async ({ staffId, reqBody }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await updateStaffAPI(staffId, reqBody, reqHeader);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update staff');
    }
  }
);

export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async (staffId, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await deleteStaffAPI(staffId, reqHeader);
      return { staffId, message: response.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete staff');
    }
  }
);

export const updatePermissions = createAsyncThunk(
  'staff/updatePermissions',
  async ({ staffId, permissions }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await updatePermissionsAPI(staffId, { permissions }, reqHeader);
      return { staffId, permissions: response.data.permissions };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update permissions');
    }
  }
);

export const getPermissions = createAsyncThunk(
  'staff/getPermissions',
  async (staffId, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await getPermissionsAPI(staffId, reqHeader);
      return { staffId, permissions: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to get permissions');
    }
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    staffs: [],
    loading: false,
    error: null,
    selectedStaff: null,
    permissions: {}
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedStaff: (state, action) => {
      state.selectedStaff = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffs.push(action.payload.staff);
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllStaffs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStaffs.fulfilled, (state, action) => {
        state.loading = false;
        state.staffs = action.payload;
      })
      .addCase(getAllStaffs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.staffs.findIndex(staff => staff._id === action.payload.staff._id);
        if (index !== -1) {
          state.staffs[index] = action.payload.staff;
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffs = state.staffs.filter(staff => staff._id !== action.payload.staffId);
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePermissions.fulfilled, (state, action) => {
        state.loading = false;
        const { staffId, permissions } = action.payload;
        const index = state.staffs.findIndex(staff => staff._id === staffId);
        if (index !== -1) {
          state.staffs[index].permissions = permissions;
        }
        state.permissions[staffId] = permissions;
      })
      .addCase(updatePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      .addCase(getPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPermissions.fulfilled, (state, action) => {
        state.loading = false;
        const { staffId, permissions } = action.payload;
        state.permissions[staffId] = permissions;
      })
      .addCase(getPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setSelectedStaff } = staffSlice.actions;
export default staffSlice.reducer;