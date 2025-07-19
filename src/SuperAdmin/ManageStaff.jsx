import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Button, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress, 
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Edit, Delete, LockOpen } from '@mui/icons-material';
import StaffModal from './StaffModal';
import PermissionModal from './PermissionModal';
import { getAllStaffs, deleteStaff, clearError } from '../Redux/Slice/staffSlice';

function ManageStaff() {
  const dispatch = useDispatch();
  const { staffs, loading, error } = useSelector((state) => state.staff);
  
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [openPermissionModal, setOpenPermissionModal] = useState(false);
 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [operationType, setOperationType] = useState('');

  useEffect(() => {
    dispatch(getAllStaffs());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleOpenModal = (mode, staff = null) => {
    setModalMode(mode);
    setSelectedStaff(staff);
    setOpenModal(true);
  };

  const handleOpenPermissionModal = (staff) => {
    setSelectedStaff(staff);
    setOpenPermissionModal(true);
  };

  const handleDeleteClick = (staff) => {
    setStaffToDelete(staff);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setStaffToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!staffToDelete) return;
    
    setOperationType('delete');
    try {
      await dispatch(deleteStaff(staffToDelete._id)).unwrap();
      setSuccessMessage(`Staff "${staffToDelete.name}" deleted successfully!`);
      setSnackbarOpen(true);
      setDeleteConfirmOpen(false);
      setStaffToDelete(null);
    } catch (error) {
      console.error('Failed to delete staff:', error);
      setSnackbarOpen(true);
    } finally {
      setOperationType('');
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStaff(null);
    dispatch(getAllStaffs());
  };

  const handleClosePermissionModal = () => {
    setOpenPermissionModal(false);
    setSelectedStaff(null);
  };

  const handlePermissionSuccess = (message) => {
    setSuccessMessage(message);
    setSnackbarOpen(true);
    handleClosePermissionModal();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    setSuccessMessage('');
    if (error) {
      dispatch(clearError());
    }
  };

  const handleModalSuccess = (message) => {
    setSuccessMessage(message);
    setSnackbarOpen(true);
    handleCloseModal();
  };

  if (loading && !operationType) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-4">Manage Staff</h2>
        <Button variant="contained" color="primary" onClick={() => handleOpenModal('add')}>
          Add New Staff
        </Button>
      </div>

      {staffs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No staff members found. Add your first staff member!</p>
        </div>
      ) : (
        <TableContainer component={Paper} className="mt-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone No</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffs.map((staff) => (
                <TableRow key={staff._id}>
                  <TableCell>{staff.name || 'N/A'}</TableCell>
                  <TableCell>{staff.email || 'N/A'}</TableCell>
                  <TableCell>{staff.phoneno || 'N/A'}</TableCell>
                  <TableCell>*****</TableCell>
                  <TableCell>
                    <IconButton 
                      color='primary' 
                      onClick={() => handleOpenModal('edit', staff)}
                      title="Edit Staff"
                      disabled={loading && operationType === 'delete'}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(staff)}
                      title="Delete Staff"
                      disabled={loading && operationType === 'delete'}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton 
                      color='success' 
                      onClick={() => handleOpenPermissionModal(staff)}
                      title="Manage Permissions"
                      disabled={loading && operationType === 'delete'}
                    >
                      <LockOpen />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {openModal && (
        <StaffModal
          open={openModal}
          onClose={handleCloseModal}
          mode={modalMode}
          staff={selectedStaff}
          onSuccess={handleModalSuccess}
        />
      )}

      {openPermissionModal && (
        <PermissionModal
          open={openPermissionModal}
          onClose={handleClosePermissionModal}
          staff={selectedStaff}
          onSuccess={handlePermissionSuccess}
        />
      )}

      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
            Are you sure you want to delete staff member "{staffToDelete?.name}"? 
            This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={loading && operationType === 'delete'}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading && operationType === 'delete'}
          >
            {loading && operationType === 'delete' ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={error ? 'error' : 'success'}
          variant="filled"
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ManageStaff;