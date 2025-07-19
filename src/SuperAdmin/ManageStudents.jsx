import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import StudentModal from './StudentModal'
import { 
  fetchAllStudents, 
  deleteStudent, 
  clearError, 
  clearSuccess 
} from '../Redux/Slice/studentSlice'

function ManageStudents() {
  const dispatch = useDispatch()
  const [openModal, setOpenModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, student: null })

  const { students, loading, error, success } = useSelector((state) => state.students)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    const authToken = token || sessionStorage.getItem("token");
    
    if (authToken) {
      dispatch(fetchAllStudents());
    } else {
      console.error('No authentication token found');
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (success) {
      setOpenModal(false)
      setEditData(null)
      dispatch(clearSuccess())
    }
  }, [success, dispatch])

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(clearError())
      }, 5000)
    }
  }, [error, dispatch])

  const handleEdit = (student) => {
    setEditData(student)
    setOpenModal(true)
  }

  const handleAdd = () => {
    setEditData(null)
    setOpenModal(true)
  }

  const handleDeleteConfirm = (student) => {
    setDeleteConfirm({ open: true, student })
  }

  const handleDelete = () => {
    if (deleteConfirm.student) {
      dispatch(deleteStudent(deleteConfirm.student._id))
    }
    setDeleteConfirm({ open: false, student: null })
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setEditData(null)
  }

  const authToken = token || sessionStorage.getItem("token");
  
  if (!authToken) {
    return (
      <div className="p-4">
        <Alert severity="warning">
          Please login to manage students.
        </Alert>
      </div>
    );
  }

  if (loading && students.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="p-4">
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" className="mb-4">
          Operation completed successfully!
        </Alert>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Students</h2>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add New Student
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.contactNo}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEdit(student)}
                      disabled={loading}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteConfirm(student)}
                      disabled={loading}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, student: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
            Are you sure you want to delete student "{deleteConfirm.student?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, student: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {openModal && (
        <StudentModal
          open={openModal}
          onClose={handleCloseModal}
          student={editData}
        />
      )}
    </div>
  )
}

export default ManageStudents