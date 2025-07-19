import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { createStaff, updateStaff, clearError } from '../Redux/Slice/staffSlice';

const StaffModal = ({ open, onClose, mode, staff, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.staff);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneno: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && staff) {
      setFormData({
        name: staff.name || '',
        email: staff.email || '',
        phoneno: staff.phoneno || '',
        password: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phoneno: '',
        password: ''
      });
    }
    setErrors({});
  }, [mode, staff, open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must not exceed 50 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email must not exceed 100 characters';
    }

    if (!formData.phoneno.trim()) {
      newErrors.phoneno = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneno.replace(/\s+/g, ''))) {
      newErrors.phoneno = 'Phone number must be exactly 10 digits';
    }

    if (mode === 'add') {
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (formData.password.length > 100) {
        newErrors.password = 'Password must not exceed 100 characters';
      }
    } else if (formData.password && formData.password.length > 0) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters if provided';
      } else if (formData.password.length > 100) {
        newErrors.password = 'Password must not exceed 100 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneno: formData.phoneno.replace(/\s+/g, '')
    };

    if (mode === 'add' || (mode === 'edit' && formData.password.trim())) {
      submitData.password = formData.password;
    }

    console.log('Submitting staff data:', submitData);

    try {
      if (mode === 'add') {
        console.log('Creating new staff');
        await dispatch(createStaff(submitData)).unwrap();
        if (onSuccess) {
          onSuccess('Staff member created successfully!');
        }
      } else {
        console.log('Updating staff with ID:', staff._id);
        await dispatch(updateStaff({
          staffId: staff._id,
          reqBody: submitData
        })).unwrap();
        if (onSuccess) {
          onSuccess(`Staff member "${formData.name}" updated successfully!`);
        }
      }
    } catch (error) {
      console.error('Failed to save staff:', error);
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
    setFormData({ ...formData, phoneno: value });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'add' ? 'Add New Staff' : 'Edit Staff Details'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={!!errors.name}
          helperText={errors.name}
          disabled={loading}
          inputProps={{ maxLength: 50 }}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
          disabled={loading}
          inputProps={{ maxLength: 100 }}
        />
        <TextField
          margin="dense"
          label="Phone Number"
          fullWidth
          variant="outlined"
          value={formData.phoneno}
          onChange={handlePhoneChange}
          error={!!errors.phoneno}
          helperText={errors.phoneno || 'Enter 10-digit phone number'}
          disabled={loading}
          inputProps={{ maxLength: 10 }}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={!!errors.password}
          helperText={
            errors.password || 
            (mode === 'edit' ? 'Leave blank to keep existing password' : 'Minimum 6 characters')
          }
          placeholder={
            mode === 'edit' 
              ? 'Enter new password (leave blank to keep current)' 
              : 'Enter password'
          }
          disabled={loading}
          inputProps={{ maxLength: 100 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
              {mode === 'add' ? 'Adding...' : 'Updating...'}
            </>
          ) : (
            mode === 'add' ? 'Add Staff' : 'Update'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffModal;