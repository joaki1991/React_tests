// components/AddUserModal.jsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Select,
  Button
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'teacher', label: 'Profesor' },
  { value: 'student', label: 'Estudiante' },
  { value: 'parent', label: 'Padre/Madre' }
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const AddUserModal = ({ open, onClose, user, onUserSaved }) => {
  const isEditMode = Boolean(user);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    role: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      // Rellenar campos con datos del usuario
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        password: user.password || '', // no prellenamos por seguridad
        role: user.role || ''
      });
    } else {
      // Limpiar campos si no hay usuario
      setFormData({
        name: '',
        surname: '',
        email: '',
        password: '',
        role: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        // Actualizar usuario existente
        const response = await axios.put(`/api/users/${user.id}`, formData);
        console.log('Usuario actualizado:', response.data);
        onUserSaved(response.data);
      } else {
        // Crear nuevo usuario
        const response = await axios.post('/api/users', formData);
        console.log('Usuario creado:', response.data);
        onUserSaved(response.data);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      // Aquí podrías mostrar un snackbar de error
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {isEditMode ? 'Editar Usuario' : 'Añadir Usuario'}
        </Typography>

        <TextField
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Apellidos"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel htmlFor="password">Contraseña</InputLabel>
          <OutlinedInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(prev => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Contraseña"
          />
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Rol</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            label="Rol"
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {isEditMode ? 'Actualizar' : 'Guardar'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddUserModal;