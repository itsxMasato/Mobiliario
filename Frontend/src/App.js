import React, { useState, useEffect } from 'react';
import './App.css';
import { getMobiliario, crearMobiliario, actualizarMobiliario } from './Servicios/Api';

function App() {
  const [mobiliario, setMobiliario] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null);
  
  // Estado para el formulario
  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    descripcion: ''
  });

  // Cargar datos al montar
  useEffect(() => {
    cargarMobiliario();
  }, []);

  const cargarMobiliario = async () => {
    try {
      setCargando(true);
      const datos = await getMobiliario();
      setMobiliario(datos);
      setError(null);
    } catch (err) {
      setError("Error al cargar mobiliario: " + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const agregarOActualizar = async (e) => {
    e.preventDefault();
    if (!form.codigo || !form.nombre || !form.descripcion) {
      alert("Por favor rellena todos los campos");
      return;
    }
    
    try {
      if (editando) {
        // Actualizar
        await actualizarMobiliario(editando, form);
        setEditando(null);
      } else {
        // Crear
        await crearMobiliario(form);
      }
      
      setForm({ codigo: '', nombre: '', descripcion: '' });
      await cargarMobiliario();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEditar = (mueble) => {
    setEditando(mueble.id);
    setForm({
      codigo: mueble.codigo,
      nombre: mueble.nombre,
      descripcion: mueble.descripcion
    });
  };

  const handleCancelar = () => {
    setEditando(null);
    setForm({ codigo: '', nombre: '', descripcion: '' });
  };

  const mueblesFiltrados = mobiliario.filter(m => 
    m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="App">
      <div className="container">
        <h1>Gestión de Mobiliario</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* BUSCADOR */}
        <div className="search-section">
          <input 
            type="text" 
            placeholder="🔍 Buscar por nombre, código o descripción..." 
            className="search-bar"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* FORMULARIO */}
        <form onSubmit={agregarOActualizar} className="add-form">
          <input 
            placeholder="Código (ej. MOB-001)" 
            value={form.codigo}
            onChange={(e) => setForm({...form, codigo: e.target.value})}
          />
          <input 
            placeholder="Nombre (ej. Mesa)" 
            value={form.nombre}
            onChange={(e) => setForm({...form, nombre: e.target.value})}
          />
          <input 
            placeholder="Descripción" 
            value={form.descripcion}
            onChange={(e) => setForm({...form, descripcion: e.target.value})}
          />
          <button type="submit">
            {editando ? 'Actualizar' : 'Agregar'}
          </button>
          {editando && (
            <button type="button" onClick={handleCancelar} className="btn-cancelar">
              Cancelar
            </button>
          )}
        </form>

        {/* REJILLA DE ELEMENTOS */}
        {cargando ? (
          <div className="loading">Cargando...</div>
        ) : (
          <div className="grid-items">
            {mueblesFiltrados.length === 0 ? (
              <p className="no-results">No hay mobiliario para mostrar</p>
            ) : (
              mueblesFiltrados.map(mueble => (
                <div key={mueble.id} className="furniture-card">
                  <span className="badge">{mueble.codigo}</span>
                  <h3>{mueble.nombre}</h3>
                  <p>{mueble.descripcion}</p>
                  <div className="card-buttons">
                    <button 
                      className="btn-editar" 
                      onClick={() => handleEditar(mueble)}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
