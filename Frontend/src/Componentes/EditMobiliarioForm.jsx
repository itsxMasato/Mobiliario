import React, { useState, useEffect } from 'react';

export default function EditMobiliarioForm({ mobiliario, onGuardar, loading, onCancel }) {
  const [form, setForm] = useState({ codigo: '', nombre: '', descripcion: '', estado: 'Activo' });

  useEffect(() => {
    if (mobiliario) {
      setForm({
        codigo: mobiliario.codigo || '',
        nombre: mobiliario.nombre || '',
        descripcion: mobiliario.descripcion || '',
        estado: mobiliario.estado || 'Activo',
      });
    }
  }, [mobiliario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.codigo || !form.nombre || !form.descripcion) return;
    if (onGuardar) await onGuardar(form);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-mobiliario-form">
      <input
        placeholder="Código (ej. MOB-001)"
        value={form.codigo}
        onChange={(e) => setForm({ ...form, codigo: e.target.value })}
      />
      <input
        placeholder="Nombre"
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
      />
      <input
        placeholder="Descripción"
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
      />
      <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
        <option value="Activo">Activo</option>
        <option value="En mantenimiento">En mantenimiento</option>
        <option value="En uso">En uso</option>
        <option value="Reservado">Reservado</option>
      </select>

      <div className="form-actions">
        <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancelar">Cancelar</button>
        )}
      </div>
    </form>
  );
}
