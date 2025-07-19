import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  DialogActions,
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import StaffStudentModal from './StaffStudentModal'
import {
  getAllStudentsByStaff,
  deleteStudentByStaff,
  clearMessages
} from '../Redux/Slice/staffStudentSlice'

function ViewStudents() {
  const dispatch = useDispatch()
  const { students, loading, error, successMessage, operationType } = useSelector(
    (state) => state.staffStudents
  )
  const { token } = useSelector((state) => state.auth)

  const [openModal, setOpenModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [hasViewPermission, setHasViewPermission] = useState(true)

  useEffect(() => {
    if (token) {
      dispatch(getAllStudentsByStaff(token))
    }
  }, [dispatch, token])

  useEffect(() => {
    if (error && error.includes('Permission denied to view students')) {
      setHasViewPermission(false)
    } else if (!error) {
      setHasViewPermission(true)
    }
  }, [error])

  useEffect(() => {
    if (error || successMessage) {
      setSnackbarOpen(true)
    }
  }, [error, successMessage])

  const handleEdit = (student) => {
    setEditData(student)
    setOpenModal(true)
  }

  const handleAdd = () => {
    setEditData(null)
    setOpenModal(true)
  }

  const handleDeleteClick = (student) => {
    setStudentToDelete(student)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (studentToDelete && token) {
      await dispatch(deleteStudentByStaff({
        studentId: studentToDelete._id,
        token
      }))
      setDeleteConfirmOpen(false)
      setStudentToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    setStudentToDelete(null)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
    dispatch(clearMessages())
  }

  const handleModalClose = () => {
    setOpenModal(false)
    setEditData(null)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Students</h2>
        {hasViewPermission && (
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add New Student
          </Button>
        )}
      </div>

      {loading && operationType === 'fetch' && (
        <div className="flex justify-center p-4">
          <CircularProgress />
        </div>
      )}

      {!hasViewPermission && error && (
        <Paper className="p-4">
          <Alert severity="error">
            {error}
          </Alert>
        </Paper>
      )}

      {hasViewPermission && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.contactNo}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEdit(student)}
                      disabled={loading && operationType === 'update'}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(student)}
                      disabled={loading && operationType === 'delete'}
                    >
                      {loading && operationType === 'delete' ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Delete />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {openModal && (
        <StaffStudentModal
          open={openModal}
          onClose={handleModalClose}
          student={editData}
        />
      )}

      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
            Are you sure you want to delete student "{studentToDelete?.name}"? 
            This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading}
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
  )
}

export default ViewStudents