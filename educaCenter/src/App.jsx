import React from 'react';
import Header from './components/Header';

function App() {
  return (
    <>
      <Header
        userName="Juan Pérez"
        userImage="https://i.pravatar.cc/150?img=3"
        onLogout={() => console.log('Logout')}
        onMessages={() => console.log('Messages')}
      />
      <div style={{ paddingTop: '120px' }}>
        {/* Aquí va el resto del contenido */}
        <p>Contenido de ejemplo debajo del header.</p>
      </div>
    </>
  );
}

export default App;
