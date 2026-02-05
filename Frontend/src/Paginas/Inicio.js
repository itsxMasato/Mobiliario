import { useEffect, useState } from "react";
import { getServicios, crearServicio, actualizarServicio } from "../../Servicios/Api";
import Loading from "../Componentes/Loading";
import SearchBox from "../Componentes/SearchBox";
import ServiceCard from "../Componentes/ServiceCard";
import Toast from "../Componentes/Toast";
import ServiceForm from "../Componentes/ServiceForm";
import Modal from "../Componentes/Modal";
import EditServiceForm from "../Componentes/EditServiceForm";
import "./Inicio.css";

function Home() {
  const [servicios, setServicios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [actualizando, setActualizando] = useState(false);
  const [toast, setToast] = useState({ type: "", text: "" });
  const [error, setError] = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: "", text: "" }), 3000);
  };

  const cargar = () => {
    setLoading(true);
    setError(null);
    getServicios()
      .then((data) => setServicios(data))
      .catch((e) => {
        const msg = "No se pudieron cargar los servicios.";
        setError(msg);
        showToast("error", msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardarServicio = async (payload) => {
    try {
      setGuardando(true);
      await crearServicio(payload);
      showToast("success", "Servicio creado correctamente.");
      cargar();
      return true;
    } catch (e) {
      showToast("error", e.message || "Error guardando servicio.");
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const abrirEdicion = (servicio) => {
    setSeleccionado(servicio);
    setEditOpen(true);
  };

  const guardarCambios = async (payload) => {
    try {
      setActualizando(true);
      await actualizarServicio(seleccionado.id, payload);
      showToast("success", "Servicio actualizado correctamente.");
      setEditOpen(false);
      setSeleccionado(null);
      cargar();
      return true;
    } catch (e) {
      showToast("error", e.message || "Error actualizando servicio");
      return false;
    } finally {
      setActualizando(false);
    }
  };

  const filtrados = servicios.filter((s) =>
    s.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="app-wrapper">
      <div className="app-content">
        <h2>🚀 Servicios TI</h2>
        
        <Toast 
          type={toast.type} 
          text={toast.text} 
          onClose={() => setToast({ type: "", text: "" })} 
        />

        <ServiceForm onGuardar={guardarServicio} loading={guardando} />
        
        <SearchBox value={filtro} onChange={setFiltro} />

        {error && <div className="error-message">❌ {error}</div>}

        <div className="results-info">
          {filtrados.length > 0 ? (
            <p>Se encontraron <strong>{filtrados.length}</strong> servicio{filtrados.length !== 1 ? 's' : ''}</p>
          ) : (
            <p className="no-results">😔 No hay resultados para tu búsqueda</p>
          )}
        </div>

        <div className="lista-servicios">
          {filtrados.map((s) => (
            <ServiceCard key={s.id} servicio={s} onEdit={abrirEdicion} />
          ))}
        </div>

        <Modal open={editOpen} title="Editar Servicio" onClose={() => setEditOpen(false)}>
          <EditServiceForm
            servicio={seleccionado}
            onGuardar={guardarCambios}
            loading={actualizando}
          />
        </Modal>
      </div>
    </div>
  );
}

export default Home;