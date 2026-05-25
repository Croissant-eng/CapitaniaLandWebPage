import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    api.get('/reservas')
      .then(response => setReservas(response.data))
      .catch(error => console.error("Error:", error));
  }, []);

  return (
    <div className="table-container">
      <h3>Lista de Reservas</h3>
      {/* Añadimos las clases de diseño aquí */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {reservas.length > 0 ? reservas.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.nombre || 'N/A'}</td>
              <td>{r.fecha || 'N/A'}</td>
              <td>{r.estado || 'N/A'}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" style={{textAlign: 'center', color: 'var(--muted)'}}>
                No hay reservas registradas en la base de datos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reservas;