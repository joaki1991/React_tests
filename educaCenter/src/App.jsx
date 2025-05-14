// App.js
import React, { useState } from 'react';
import Header from './components/Header';
import SidePanelLayout from './components/SidePanelLayout';
import UsersPanel from './components/UsersPanel';
import AddUserModal from './components/AddUserModal';

function App() {
  // Estado de usuarios de ejemplo
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'María',
      surname: 'González',
      email: 'maria@example.com',
      role: 'Administrador',
      group_name: 'Profesor'
    },
    {
      id: 2,
      name: 'Luis',
      surname: 'Pérez',
      email: 'luis@example.com',
      role: 'Usuario',
      group_name: 'Estudiante'
    }
  ]);  
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openAddUserModal = () => {
    setSelectedUser(null); // modo creación
    setModalOpen(true);
  };

  const openEditUserModal = (user) => {
    setSelectedUser(user); // modo edición
    setModalOpen(true);
  };

  const handleUserSaved = (savedUser) => {
    setUsers((prevUsers) => {
      const exists = prevUsers.find((u) => u.id === savedUser.id);
      if (exists) {
        return prevUsers.map((u) => (u.id === savedUser.id ? savedUser : u));
      } else {
        return [...prevUsers, savedUser];
      }
    });
  };

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleLinkUser = (user) => {
    console.log('Vincular:', user);
  };

  const header = (
    <Header
      userName="Juan Pérez Fernandez"
      userImage="https://i.pravatar.cc/150?img=2"
      onLogout={() => console.log('Logout')}
      onMessages={() => console.log('Messages')}
      logoImage="https://amafi.org/wp-content/uploads/2024/04/educamos-slide.png"
    />
  );

  return (
    <SidePanelLayout header={header}>
      <UsersPanel
        users={users}
        onAdd={openAddUserModal}
        onEdit={openEditUserModal}
        onDelete={handleDeleteUser}
        onLink={handleLinkUser}
      />
      <AddUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
        onUserSaved={handleUserSaved}
      />
    </SidePanelLayout>
  );
}

export default App;