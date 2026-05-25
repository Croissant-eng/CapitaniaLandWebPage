import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    // Asegúrate de que esta ruta '/eventos_especiales' coincida con tu backend
    api.get('/eventos_especiales')
      .then(response => setEventos(response.data))
      .catch(error => console.error("Error cargando eventos:", error));
  }, []);

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map(e => (
            <tr key={e.id}>
              <td>{e.titulo}</td>
              <td>{e.descripcion}</td>
              <td>{e.fecha_evento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Eventos;