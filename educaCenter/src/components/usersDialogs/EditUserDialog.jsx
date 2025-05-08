import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import api from '../api/axios';

const EditUserDialog = ({ open, onClose, userId, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    role: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (userId) {
      // Obtener los datos del usuario al abrir el modal
      api.get(`/users.php?id=${userId}`)
        .then(res => {
          const user = res.data;
          setFormData({
            name: user.name || '',
            surname: user.surname || '',
            email: user.email || '',
            role: user.role || '',
            password: '' // No se muestra la contraseña en el modal
          });
        })
        .catch(err => {
          console.error('Error al cargar los datos del usuario:', err);
          setSnackbar({
            open: true,
            message: 'Error al cargar los datos del usuario',
            severity: 'error'
          });
        });
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.surname.trim()) newErrors.surname = 'Los apellidos son obligatorios';
    if (!formData.role.trim()) newErrors.role = 'El rol es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
  
    const payload = {
      id: userId,
      name: formData.name.trim(),
      surname: formData.surname.trim(),
      email: formData.email?.trim() || '',
      role: formData.role.trim(),
      password: formData.password || ''
    };
  
    api.put('/users.php', payload) // Cambié de POST a PUT aquí
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Usuario editado correctamente',
          severity: 'success'
        });
        
        if (typeof onUserUpdated === 'function') {
          onUserUpdated(); // Notifica al padre para que recargue
        }
  
        handleCancel(); // Limpia el formulario
      })
      .catch(err => {
        console.error('Error al editar el usuario:', err);
        setSnackbar({
          open: true,
          message: 'Error al editar el usuario',
          severity: 'error'
        });
      });
  };

  const handleCancel = () => {
    setFormData({ name: '', surname: '', email: '', role: '', password: '' });
    setErrors({});
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate>
            <TextField
              margin="normal"
              fullWidth
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Apellidos"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
              error={!!errors.surname}
              helperText={errors.surname}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal" required error={!!errors.role}>
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Rol"
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="teacher">Profesor</MenuItem>
                <MenuItem value="student">Estudiante</MenuItem>
                <MenuItem value="parent">Padre/Madre</MenuItem>
              </Select>
            </FormControl>
            {errors.role && (
              <Box mt={0.5} ml={1} color="error.main" fontSize="0.75rem">
                {errors.role}
              </Box>
            )}

            <TextField
              margin="normal"
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditUserDialog;