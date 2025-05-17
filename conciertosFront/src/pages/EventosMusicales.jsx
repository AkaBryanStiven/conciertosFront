import { useState } from "react";
import { useModal } from "../hooks/useModal";
import { useFetchData } from "../hooks/useFetchData";
import EventoCard from "../components/cards/EventoCard";
import ModalAgregar from "../components/modals/ModalAgregar";
import ModalEditar from "../components/modals/ModalEditar";
import ModalConfirmar from "../components/modals/ModalConfirmar";
import SearchBar from "../components/shared/SearchBar";

const defaultForm = {
  nombre: "",
  año: 0,
  ubicacion: "",
  bandas_participantes: [],
  asistencia_estimada: 0,
  duracion_dias: 0,
  leyenda: false
};

export default function EventosMusicales() {
  const { data: eventos, refetch } = useFetchData("eventos/obtenerTodos");
  const [busqueda, setBusqueda] = useState("");
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  const {
    isOpen: showAgregar,
    formData: form,
    setFormData: setForm,
    openModal: openAgregar,
    closeModal: closeAgregar,
  } = useModal(defaultForm);

  const {
    isOpen: showEditar,
    formData: editForm,
    setFormData: setEditForm,
    selectedItem: selectedEvento,
    openModal: openEditar,
    closeModal: closeEditar,
  } = useModal(defaultForm);

  const {
    isOpen: showConfirmar,
    selectedItem: eventoToDelete,
    openModal: openConfirmar,
    closeModal: closeConfirmar,
  } = useModal();

  const buscarPorNombre = async () => {
    if (!busqueda.trim()) {
      refetch();
      setEventosFiltrados([]);
      return;
    }
    
    try {
      const res = await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/eventos/obtenerPorNombre/${busqueda}`
      );
      const data = await res.json();
      setEventosFiltrados(data ? [data] : []);
    } catch (error) {
      console.error("Error al buscar evento:", error);
      setEventosFiltrados([]);
    }
  };

  const agregarEvento = async () => {
    try {
      await fetch(
        "https://conciertosback.onrender.com/conciertosBaraticos/eventos/agregar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            bandas_participantes: form.bandas_participantes.split(',').map(b => b.trim())
          }),
        }
      );
      closeAgregar();
      refetch();
      setEventosFiltrados([]);
    } catch (error) {
      console.error("Error al agregar evento:", error);
    }
  };

  const actualizarEvento = async () => {
    try {
      await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/eventos/editar/${selectedEvento._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editForm,
            bandas_participantes: editForm.bandas_participantes.split(',').map(b => b.trim())
          }),
        }
      );
      closeEditar();
      refetch();
      setEventosFiltrados([]);
    } catch (error) {
      console.error("Error al editar evento:", error);
    }
  };

  const eliminarEvento = async () => {
    try {
      await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/eventos/eliminar/${eventoToDelete._id}`,
        {
          method: "DELETE",
        }
      );
      closeConfirmar();
      refetch();
      setEventosFiltrados([]);
    } catch (error) {
      console.error("Error al eliminar evento:", error);
    }
  };

  const eventosAMostrar = busqueda.trim() ? eventosFiltrados : eventos;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <SearchBar
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onSearch={buscarPorNombre}
          placeholder="Buscar evento por nombre..."
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-all"
          onClick={() => openAgregar()}
        >
          + Agregar Evento
        </button>
      </div>

      <ModalAgregar
        isOpen={showAgregar}
        onClose={closeAgregar}
        onAdd={agregarEvento}
        form={form}
        setForm={setForm}
        title="Agregar Evento Musical"
      />

      <ModalEditar
        isOpen={showEditar}
        onClose={closeEditar}
        form={editForm}
        setForm={setEditForm}
        onUpdate={actualizarEvento}
        title="Editar Evento Musical"
      />

      <ModalConfirmar
        isOpen={showConfirmar}
        onClose={closeConfirmar}
        onConfirm={eliminarEvento}
        nombre={eventoToDelete?.nombre}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventosAMostrar.map((evento) => (
          <EventoCard
            key={evento._id}
            item={evento}
            onEdit={openEditar}
            onDelete={openConfirmar}
          />
        ))}
      </div>
    </div>
  );
}