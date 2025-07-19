import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Typography,
  Divider
} from '@mui/material';
import { updatePermissions, getPermissions, clearError } from '../Redux/Slice/staffSlice';

const PermissionModal = ({ open, onClose, staff, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.staff);
  
  const [permissions, setPermissions] = useState({
    createStudent: false,
    editStudent: false,
    viewStudent: false,
    deleteStudent: false
  });

  const [initialPermissions, setInitialPermissions] = useState({});

  useEffect(() => {
    if (staff?._id && open) {
      if (staff.permissions) {
        const currentPerms = {
          createStudent: staff.permissions.createStudent || false,
          editStudent: staff.permissions.editStudent || false,
          viewStudent: staff.permissions.viewStudent || false,
          deleteStudent: staff.permissions.deleteStudent || false
        };
        setPermissions(currentPerms);
        setInitialPermissions(currentPerms);
      } else {
        dispatch(getPermissions(staff._id));
      }
    }
  }, [staff, dispatch, open]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPermissions(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(permissions).every(perm => perm);
    const newState = !allSelected;
    setPermissions({
      createStudent: newState,
      editStudent: newState,
      viewStudent: newState,
      deleteStudent: newState
    });
  };

  const handleSubmit = async () => {
    try {
      await dispatch(updatePermissions({ 
        staffId: staff._id, 
        permissions 
      })).unwrap();
      
      if (onSuccess) {
        onSuccess(`Permissions updated successfully for "${staff.name}"`);
      }
    } catch (error) {
      console.error('Failed to update permissions:', error);
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  const hasChanges = () => {
    return Object.keys(permissions).some(
      key => permissions[key] !== initialPermissions[key]
    );
  };

  const getSelectedCount = () => {
    return Object.values(permissions).filter(perm => perm).length;
  };

  const permissionLabels = {
    createStudent: 'Create Student',
    editStudent: 'Edit Student',
    viewStudent: 'View Student',
    deleteStudent: 'Delete Student'
  };

  const permissionDescriptions = {
    createStudent: 'Allow staff to add new students to the system',
    editStudent: 'Allow staff to modify existing student information',
    viewStudent: 'Allow staff to view student details and records',
    deleteStudent: 'Allow staff to remove students from the system'
  };

  const allSelected = Object.values(permissions).every(perm => perm);
  const someSelected = Object.values(permissions).some(perm => perm);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div>
          <Typography variant="h6" component="div">
            Manage Permissions
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {staff?.name} ({staff?.email})
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="mb-4">
          <Typography variant="body2" color="text.secondary" className="mb-2">
            Selected: {getSelectedCount()}/4 permissions
          </Typography>
          
          <Button
            size="small"
            variant="outlined"
            onClick={handleSelectAll}
            disabled={loading}
            className="mb-3"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
        
        <Divider className="mb-3" />
        
        <FormGroup>
          {Object.keys(permissions).map((perm) => (
            <div key={perm} className="mb-3">
              <FormControlLabel
                control={
                  <Checkbox
                    name={perm}
                    checked={permissions[perm]}
                    onChange={handleChange}
                    disabled={loading}
                    color="primary"
                  />
                }
                label={
                  <div>
                    <Typography variant="body1" fontWeight="medium">
                      {permissionLabels[perm]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {permissionDescriptions[perm]}
                    </Typography>
                  </div>
                }
              />
            </div>
          ))}
        </FormGroup>

        {!hasChanges() && (
          <Typography variant="body2" color="text.secondary" className="mt-3">
            No changes made to permissions
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading || !hasChanges()}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
              Saving...
            </>
          ) : (
            'Save Permissions'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionModal;