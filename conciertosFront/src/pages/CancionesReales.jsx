import { useState } from "react";
import { useModal } from "../hooks/useModal";
import { useFetchData } from "../hooks/useFetchData";
import CancionCard from "../components/cards/CancionCard";
import ModalAgregar from "../components/modals/ModalAgregar";
import ModalEditar from "../components/modals/ModalEditar";
import ModalConfirmar from "../components/modals/ModalConfirmar";
import SearchBar from "../components/shared/SearchBar";

const defaultForm = {
  titulo: "",
  banda_original: "",
  año_lanzamiento: 0,
  genero: "",
  duracion_segundos: 0,
  tiene_solo_guitarra: false,
  es_clasico: false,
  veces_versionada: 0,
  idioma: "",
  popularidad_global: 0
};

export default function CancionesReales() {
  const { data: canciones, refetch } = useFetchData("canciones/obtenerTodas");
  const [busqueda, setBusqueda] = useState("");
  const [cancionesFiltradas, setCancionesFiltradas] = useState([]);

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
    selectedItem: selectedCancion,
    openModal: openEditar,
    closeModal: closeEditar,
  } = useModal(defaultForm);

  const {
    isOpen: showConfirmar,
    selectedItem: cancionToDelete,
    openModal: openConfirmar,
    closeModal: closeConfirmar,
  } = useModal();

  const buscarPorTitulo = async () => {
    if (!busqueda.trim()) {
      refetch();
      setCancionesFiltradas([]);
      return;
    }
    
    try {
      const res = await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/canciones/obtenerPorTitulo/${busqueda}`
      );
      const data = await res.json();
      setCancionesFiltradas(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error al buscar canción:", error);
      setCancionesFiltradas([]);
    }
  };

  const agregarCancion = async () => {
    try {
      await fetch(
        "https://conciertosback.onrender.com/conciertosBaraticos/canciones/agregar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      closeAgregar();
      refetch();
      setCancionesFiltradas([]);
    } catch (error) {
      console.error("Error al agregar canción:", error);
    }
  };

  const actualizarCancion = async () => {
    try {
      await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/canciones/actualizar/${selectedCancion.titulo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );
      closeEditar();
      refetch();
      setCancionesFiltradas([]);
    } catch (error) {
      console.error("Error al editar canción:", error);
    }
  };

  const eliminarCancion = async () => {
    try {
      await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/canciones/eliminar/${cancionToDelete.titulo}`,
        {
          method: "DELETE",
        }
      );
      closeConfirmar();
      refetch();
      setCancionesFiltradas([]);
    } catch (error) {
      console.error("Error al eliminar canción:", error);
    }
  };

  const cancionesAMostrar = busqueda.trim() ? cancionesFiltradas : canciones;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <SearchBar
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onSearch={buscarPorTitulo}
          placeholder="Buscar canción por título..."
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-all"
          onClick={() => openAgregar()}
        >
          + Agregar Canción
        </button>
      </div>

      <ModalAgregar
        isOpen={showAgregar}
        onClose={closeAgregar}
        onAdd={agregarCancion}
        form={form}
        setForm={setForm}
        title="Agregar Canción Real"
      />

      <ModalEditar
        isOpen={showEditar}
        onClose={closeEditar}
        form={editForm}
        setForm={setEditForm}
        onUpdate={actualizarCancion}
        title="Editar Canción Real"
      />

      <ModalConfirmar
        isOpen={showConfirmar}
        onClose={closeConfirmar}
        onConfirm={eliminarCancion}
        nombre={cancionToDelete?.titulo}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cancionesAMostrar.map((cancion) => (
          <CancionCard
            key={cancion._id || cancion.titulo}
            item={cancion}
            onEdit={openEditar}
            onDelete={openConfirmar}
          />
        ))}
      </div>
    </div>
  );
}