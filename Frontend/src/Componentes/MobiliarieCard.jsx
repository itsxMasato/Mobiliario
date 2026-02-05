import React from 'react';

export default function MobiliarieCard({ mobiliario, onEdit }) {
  if (!mobiliario) return null;

  return (
    <div className="furniture-card">
      <span className="badge">{mobiliario.codigo}</span>
      <h3>{mobiliario.nombre}</h3>
      <p>{mobiliario.descripcion}</p>
      <p className="estado">Estado: {mobiliario.estado || '—'}</p>
      <div className="card-buttons">
        <button className="btn-editar" onClick={() => onEdit && onEdit(mobiliario)}>
          Editar
        </button>
      </div>
    </div>
  );
}
