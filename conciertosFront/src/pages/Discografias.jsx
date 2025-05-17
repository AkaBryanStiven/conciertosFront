import { useState } from "react";
import { useModal } from "../hooks/useModal";
import { useFetchData } from "../hooks/useFetchData";
import DiscografiaCard from "../components/cards/DiscografiaCard";
import ModalAgregar from "../components/modals/ModalAgregar";
import ModalEditar from "../components/modals/ModalEditar";
import ModalConfirmar from "../components/modals/ModalConfirmar";
import SearchBar from "../components/shared/SearchBar";

const defaultForm = {
  titulo: "",
  banda: "",
  año_lanzamiento: 0,
  genero: "",
  canciones: [],
  duracion_minutos: 0,
  discografica: "",
  certificaciones: "",
  portada: ""
};

export default function Discografias() {
  const { data: discografias, refetch } = useFetchData("discografias/obtenerTodas");
  const [busqueda, setBusqueda] = useState("");
  const [discografiasFiltradas, setDiscografiasFiltradas] = useState([]);

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
    selectedItem: selectedDiscografia,
    openModal: openEditar,
    closeModal: closeEditar,
  } = useModal(defaultForm);

  const {
    isOpen: showConfirmar,
    selectedItem: discografiaToDelete,
    openModal: openConfirmar,
    closeModal: closeConfirmar,
  } = useModal();

  const buscarPorTitulo = async () => {
    if (!busqueda.trim()) {
      refetch();
      setDiscografiasFiltradas([]);
      return;
    }
    
    try {
      const res = await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/discografias/obtenerPorTitulo/${busqueda}`
      );
      const data = await res.json();
      setDiscografiasFiltradas(data ? [data] : []);
    } catch (error) {
      console.error("Error al buscar discografía:", error);
      setDiscografiasFiltradas([]);
    }
  };

  const agregarDiscografia = async () => {
    try {
      await fetch(
        "https://conciertosback.onrender.com/conciertosBaraticos/discografias/agregar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            canciones: form.canciones.split(',').map(c => c.trim())
          }),
        }
      );
      closeAgregar();
      refetch();
      setDiscografiasFiltradas([]);
    } catch (error) {
      console.error("Error al agregar discografía:", error);
    }
  };

  const actualizarDiscografia = async () => {
    try {
      await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/discografias/editar/${selectedDiscografia._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editForm,
            canciones: editForm.canciones.split(',').map(c => c.trim())
          }),
        }
      );
      closeEditar();
      refetch();
      setDiscografiasFiltradas([]);
    } catch (error) {
      console.error("Error al editar discografía:", error);
    }
  };

  const eliminarDiscografia = async () => {
    try {
      await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/discografias/eliminar/${discografiaToDelete._id}`,
        {
          method: "DELETE",
        }
      );
      closeConfirmar();
      refetch();
      setDiscografiasFiltradas([]);
    } catch (error) {
      console.error("Error al eliminar discografía:", error);
    }
  };

  const discografiasAMostrar = busqueda.trim() ? discografiasFiltradas : discografias;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <SearchBar
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onSearch={buscarPorTitulo}
          placeholder="Buscar discografía por título..."
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-all"
          onClick={() => openAgregar()}
        >
          + Agregar Discografía
        </button>
      </div>

      <ModalAgregar
        isOpen={showAgregar}
        onClose={closeAgregar}
        onAdd={agregarDiscografia}
        form={form}
        setForm={setForm}
        title="Agregar Discografía"
      />

      <ModalEditar
        isOpen={showEditar}
        onClose={closeEditar}
        form={editForm}
        setForm={setEditForm}
        onUpdate={actualizarDiscografia}
        title="Editar Discografía"
      />

      <ModalConfirmar
        isOpen={showConfirmar}
        onClose={closeConfirmar}
        onConfirm={eliminarDiscografia}
        nombre={discografiaToDelete?.titulo}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discografiasAMostrar.map((discografia) => (
          <DiscografiaCard
            key={discografia._id}
            item={discografia}
            onEdit={openEditar}
            onDelete={openConfirmar}
          />
        ))}
      </div>
    </div>
  );
}