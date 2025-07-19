import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material'
import { createStudent, updateStudent, clearError } from '../Redux/Slice/studentSlice'

function StudentModal({ open, onClose, student }) {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.students)

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    contactNo: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        age: student.age?.toString() || '',
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
    setErrors({})
  }, [student, open])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.age) {
      newErrors.age = 'Age is required'
    } else if (formData.age < 1 || formData.age > 100) {
      newErrors.age = 'Age must be between 1 and 100'
    }

    if (!formData.grade.trim()) {
      newErrors.grade = 'Grade is required'
    }

    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required'
    } else if (!/^\d{10}$/.test(formData.contactNo)) {
      newErrors.contactNo = 'Contact number must be 10 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }
    const submitData = {
      ...formData,
      age: parseInt(formData.age)
    }

    console.log('Submitting form data:', submitData);

    try {
      if (student) {
        console.log('Updating student with ID:', student._id);
        await dispatch(updateStudent({
          studentId: student._id,
          reqBody: submitData
        })).unwrap()
      } else {
        console.log('Creating new student');
        await dispatch(createStudent(submitData)).unwrap()
      }
      
    } catch (error) {
      console.error('Failed to save student:', error)
    }
  }

  const handleClose = () => {
    dispatch(clearError())
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{student ? 'Edit Student' : 'Add New Student'}</DialogTitle>
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
        />
        <TextField
          margin="dense"
          label="Age"
          fullWidth
          type="number"
          variant="outlined"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          error={!!errors.age}
          helperText={errors.age}
          disabled={loading}
        />
        <TextField
          margin="dense"
          label="Grade"
          fullWidth
          variant="outlined"
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          error={!!errors.grade}
          helperText={errors.grade}
          disabled={loading}
        />
        <TextField
          margin="dense"
          label="Contact Number"
          fullWidth
          variant="outlined"
          value={formData.contactNo}
          onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
          error={!!errors.contactNo}
          helperText={errors.contactNo}
          disabled={loading}
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
              <CircularProgress size={20} className="mr-2" />
              {student ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            student ? 'Update' : 'Add'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StudentModal