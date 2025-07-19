import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  createStudentByStaff,
  updateStudentByStaff,
  clearMessages,
  clearOperationType
} from '../Redux/Slice/staffStudentSlice'

function StaffStudentModal({ open, onClose, student }) {
  const dispatch = useDispatch()
  const { loading, error, successMessage, operationType } = useSelector(
    (state) => state.staffStudents
  )
  const { token } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    contactNo: '',
  })

  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        age: student.age || '',
        grade: student.grade || '',
        contactNo: student.contactNo || '',
      })
    } else {
      setFormData({
        name: '',
        age: '',
        grade: '',
        contactNo: '',
      })
    }
    dispatch(clearMessages())
    setFormErrors({})
  }, [student, dispatch])

  useEffect(() => {
    if (successMessage && (operationType === 'create' || operationType === 'update')) {
      dispatch(clearOperationType())
      onClose()
    }
  }, [successMessage, operationType, onClose, dispatch])

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.age || formData.age.toString().trim() === '') {
      errors.age = 'Age is required'
    } else if (isNaN(formData.age) || parseInt(formData.age) <= 0) {
      errors.age = 'Please enter a valid age'
    }

    if (!formData.grade.trim()) {
      errors.grade = 'Grade is required'
    }

    if (!formData.contactNo.trim()) {
      errors.contactNo = 'Contact number is required'
    } else if (!/^\d{10}$/.test(formData.contactNo.trim())) {
      errors.contactNo = 'Please enter a valid 10-digit contact number'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    const studentData = {
      name: formData.name.trim(),
      age: parseInt(formData.age),
      grade: formData.grade.trim(),
      contactNo: formData.contactNo.trim(),
    }

    try {
      if (student && student._id) {
        const result = await dispatch(updateStudentByStaff({
          studentId: student._id,
          studentData,
          token
        }))
        
        if (result.type.endsWith('/fulfilled')) {
        }
      } else {
        const result = await dispatch(createStudentByStaff({
          studentData,
          token
        }))
        
        if (result.type.endsWith('/fulfilled')) {
        }
      }
    } catch (error) {
      console.error('Operation failed:', error)
    }
  }

  const handleClose = () => {
    dispatch(clearMessages())
    onClose()
  }

  const isFormLoading = loading && (operationType === 'create' || operationType === 'update')

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{student ? 'Edit Student' : 'Add New Student'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Name"
          fullWidth
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={!!formErrors.name}
          helperText={formErrors.name}
          disabled={isFormLoading}
        />
        
        <TextField
          margin="dense"
          name="age"
          label="Age"
          fullWidth
          type="number"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          error={!!formErrors.age}
          helperText={formErrors.age}
          disabled={isFormLoading}
        />
        
        <TextField
          margin="dense"
          name="grade"
          label="Grade"
          fullWidth
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          error={!!formErrors.grade}
          helperText={formErrors.grade}
          disabled={isFormLoading}
        />
        
        <TextField
          margin="dense"
          name="contactNo"
          label="Contact Number"
          fullWidth
          value={formData.contactNo}
          onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
          error={!!formErrors.contactNo}
          helperText={formErrors.contactNo}
          disabled={isFormLoading}
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={isFormLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isFormLoading}
        >
          {isFormLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            student ? 'Update' : 'Add'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StaffStudentModal