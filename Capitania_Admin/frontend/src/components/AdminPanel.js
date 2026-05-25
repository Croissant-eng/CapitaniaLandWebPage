import React, { useState } from 'react';
// Asegúrate de que esta ruta sea la correcta para tu archivo de imagen
import logo from '../assets/Logo Capitania Transparente.png'; 
import Reservas from './Reservas';
import Eventos from './Eventos';
import Promociones from './Promociones';

const AdminPanel = () => {
  // Estado para controlar qué sección está abierta
  const [activeTab, setActiveTab] = useState('Reservas');

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token'); // Si usas tokens
    window.location.href = '/login';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Logo en lugar de texto */}
          <img 
            src={logo} 
            alt="Capitania Logo" 
            style={{ width: '100%', maxWidth: '180px', height: 'auto', display: 'block', margin: '0 auto' }} 
          />
        </div>
        <ul className="nav-menu">
          {['Reservas', 'Eventos', 'Promociones'].map((tab) => (
            <li 
              key={tab}
              className={`nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <div className="topbar">
          <h1>{activeTab}</h1>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>

        <div className="dashboard-content">
          {/* Renderizado dinámico según la pestaña seleccionada */}
          {activeTab === 'Reservas' && <Reservas />}
          {activeTab === 'Eventos' && <Eventos />}
          {activeTab === 'Promociones' && <Promociones />}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;