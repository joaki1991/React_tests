import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from '@mui/material';
import SidePanelLayout from '../components/SidePanelLayout';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.png';
import API_BASE from '../api/config';
import AddGroupDialog from '../components/groupsDialogs/AddGroupDialog'; 
import EditGroupDialog from '../components/groupsDialogs/EditGroupDialog'; 
import DeleteGroupDialog from '../components/groupsDialogs/DeleteGroupDialog'; 
import GroupsPanel from '../components/GroupsPanel'; // Panel para mostrar grupos
import api from '../api/axios'; 

function GroupsAdmin({ onLogout }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para diálogos
  const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);
  const [editGroupDialogOpen, setEditGroupDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const user = localStorage.getItem('EducaCenterUser');
  const userId = localStorage.getItem('EducaCenterId');

  useEffect(() => {
    setLoading(true);
    api.get('/groups.php')  
      .then(res => {
        if (Array.isArray(res.data)) {
          setGroups(res.data);
        } else {
          console.warn('Respuesta inesperada:', res.data);
          setGroups([]);
        }
      })
      .catch(err => {
        console.error('Error al cargar grupos:', err);
        setGroups([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddGroup = () => {
    setSelectedGroup(null);
    setAddGroupDialogOpen(true);
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setEditGroupDialogOpen(true);
  };

  const handleDeleteGroup = (groupId) => {
    const groupToDelete = groups.find(g => g.id === groupId);
    setSelectedGroup(groupToDelete);
    setDeleteGroupDialogOpen(true);
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
      <Typography variant="h5" mb={2}>Gestión de Grupos</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(3)].map((__, colIndex) => (
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

  // Función para recargar la lista de grupos tras una acción (agregar, editar, eliminar)
  const reloadGroups = () => {
    setLoading(true);
    api.get('/groups.php')  // Suponiendo que la API para grupos es /groups.php
      .then(res => {
        if (Array.isArray(res.data)) {
          setGroups(res.data);
        } else {
          console.warn('Respuesta inesperada:', res.data);
          setGroups([]);
        }
      })
      .catch(err => {
        console.error('Error al cargar grupos:', err);
        setGroups([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
          <GroupsPanel
            groups={groups}
            onAdd={handleAddGroup}
            onEdit={handleEditGroup}
            onDelete={handleDeleteGroup}
          />
        )}
      </SidePanelLayout>

      {/* Diálogos para grupos */}
      <AddGroupDialog
        open={addGroupDialogOpen}
        onClose={() => { setAddGroupDialogOpen(false); reloadGroups(); }}
        type="add"
      />
      <EditGroupDialog
        open={editGroupDialogOpen}
        onClose={() => { setEditGroupDialogOpen(false); reloadGroups(); }}
        type="edit"
        group={selectedGroup}
      />
      <DeleteGroupDialog
        open={deleteGroupDialogOpen}
        onClose={() => { setDeleteGroupDialogOpen(false); reloadGroups(); }}
        type="delete"
        group={selectedGroup}
      />

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

export default GroupsAdmin;