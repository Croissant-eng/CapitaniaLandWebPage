import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Promociones = () => {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    api.get('/promociones')
      .then(response => setPromos(response.data))
      .catch(error => console.error("Error cargando promos:", error));
  }, []);

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr><th>Nombre</th><th>Descripción</th><th>Precio</th></tr>
        </thead>
        <tbody>
          {promos.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>{p.precio_destacado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Promociones;