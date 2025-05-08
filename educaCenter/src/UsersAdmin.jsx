import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from '@mui/material';
import SidePanelLayout from '../components/SidePanelLayout';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.png';
import API_BASE from '../api/config';
import NewPasswordDialog from '../components/NewPasswordDialog';
import UpdateProfilePhoto from '../components/UpdateProfilePhoto';
import UsersPanel from '../components/UsersPanel';
import api from '../api/axios'; 
import AddUserDialog from '../components/usersDialogs/AddUserDialog';
import EditUserDialog from '../components/usersDialogs/EditUserDialog';
import DeleteUserDialog from '../components/usersDialogs/DeleteUserDialog';
import LinkUserDialog from '../components/usersDialogs/LinkUserDialog';

function UsersAdmin({ onLogout }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para diálogos
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const user = localStorage.getItem('EducaCenterUser');
  const userId = localStorage.getItem('EducaCenterId');

  useEffect(() => {
    setLoading(true);
    api.get('/users.php')
      .then(res => {
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.warn('Respuesta inesperada:', res.data);
          setUsers([]);
        }
      })
      .catch(err => {
        console.error('Error al cargar usuarios:', err);
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setAddDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    setSelectedUser(userToDelete);
    setDeleteDialogOpen(true);
  };

  const handleLinkUser = (user) => {
    setSelectedUser(user);
    setLinkDialogOpen(true);
  };

  const header = (
    <Header
      userName={user || 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}
      onMessages={() => console.log('Messages')}
      logoImage={logo}
      onOpenSettings={() => setSettingsOpen(true)}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
    />
  );

  const renderLoadingSkeleton = () => (
    <Box p={2}>
      <Typography variant="h5" mb={2}>Gestión de Usuarios</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Grupo</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(6)].map((__, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton variant="text" animation="wave" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <SidePanelLayout header={header}>
        {loading ? (
          renderLoadingSkeleton()
        ) : (
          <UsersPanel
            users={users}
            onAdd={handleAddUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onLink={handleLinkUser}
          />
        )}
      </SidePanelLayout>

      {/* Diálogos externos */}
      <AddUserDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
      <EditUserDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} user={selectedUser} />
      <DeleteUserDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} user={selectedUser} />
      <LinkUserDialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} user={selectedUser} />

      {/* Diálogos existentes */}
      <NewPasswordDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        userId={userId}
      />

      <UpdateProfilePhoto
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        userId={userId}
      />
    </Box>
  );
}

export default UsersAdmin;