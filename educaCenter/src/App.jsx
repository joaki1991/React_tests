import React from 'react';
import Header from './components/Header';
import SidePanelLayout from './components/SidePanelLayout';

function App() {
  const header = (
    <Header
      userName="Juan Pérez"
      userImage="https://i.pravatar.cc/150?img=2"
      onLogout={() => console.log('Logout')}
      onMessages={() => console.log('Messages')}
      logoImage="https://amafi.org/wp-content/uploads/2024/04/educamos-slide.png"
    />
  );

  return (
    <SidePanelLayout header={header}>
      <p>Contenido de ejemplo debajo del header.</p>
      <p>Este contenido y el header se desplazan a la derecha al abrir el panel.</p>
    </SidePanelLayout>
  );
}

export default App;