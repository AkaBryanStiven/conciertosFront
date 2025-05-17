import { useState } from "react";
import { useModal } from "../hooks/useModal";
import { useFetchData } from "../hooks/useFetchData";
import BandaCard from "../components/cards/BandaCard";
import ModalAgregar from "../components/modals/ModalAgregar";
import ModalEditar from "../components/modals/ModalEditar";
import ModalConfirmar from "../components/modals/ModalConfirmar";
import SearchBar from "../components/shared/SearchBar";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const defaultForm = {
  nombre: "",
  genero: "",
  año_formacion: 0,
  pais_origen: "",
  miembros_fundadores: [],
  albumes_estudio: 0,
  activa: true,
  influencias: []
};

export default function BandasReales() {
  const { data: bandas, loading, error, refetch } = useFetchData("bandasReales/obtenerTodas");
  const [busqueda, setBusqueda] = useState("");
  
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
    selectedItem: selectedBanda,
    openModal: openEditar,
    closeModal: closeEditar,
  } = useModal(defaultForm);
  
  const {
    isOpen: showConfirmar,
    selectedItem: bandaToDelete,
    openModal: openConfirmar,
    closeModal: closeConfirmar,
  } = useModal();

  const buscarPorNombre = async () => {
    if (!busqueda.trim()) {
      refetch();
      return;
    }
    try {
      const res = await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/bandasReales/obtenerPorNombre/${busqueda}`
      );
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (!data) {
        toast.warning("No se encontraron bandas con ese nombre");
        return;
      }
      
      // Asegurarnos que siempre trabajamos con un array
      const bandasData = Array.isArray(data) ? data : [data];
      setBandas(bandasData);
      
    } catch (error) {
      console.error("Error al buscar banda:", error);
      toast.error(`Error al buscar: ${error.message}`);
    }
  };

  const agregarBanda = async () => {
    try {
      const response = await fetch(
        "https://conciertosback.onrender.com/conciertosBaraticos/bandasReales/agregar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            miembros_fundadores: form.miembros_fundadores.split(',').map(m => m.trim()),
            influencias: form.influencias.split(',').map(i => i.trim())
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      toast.success("Banda agregada correctamente 🎸");
      closeAgregar();
      refetch();
    } catch (error) {
      console.error("Error al agregar banda:", error);
      toast.error(`Error al agregar: ${error.message}`);
    }
  };

  const actualizarBanda = async () => {
    try {
      const response = await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/bandasReales/editar/${selectedBanda._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editForm,
            miembros_fundadores: editForm.miembros_fundadores.split(',').map(m => m.trim()),
            influencias: editForm.influencias.split(',').map(i => i.trim())
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      toast.success("Banda actualizada correctamente");
      closeEditar();
      refetch();
    } catch (error) {
      console.error("Error al editar banda:", error);
      toast.error(`Error al actualizar: ${error.message}`);
    }
  };

  const eliminarBanda = async () => {
    try {
      const response = await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/bandasReales/eliminar/${bandaToDelete._id}`,
        {
          method: "DELETE",
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      toast.success("Banda eliminada correctamente");
      closeConfirmar();
      refetch();
    } catch (error) {
      console.error("Error al eliminar banda:", error);
      toast.error(`Error al eliminar: ${error.message}`);
    }
  };

  // Si hay error al cargar los datos iniciales
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error al cargar las bandas: {error}</p>
        <button 
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Mientras se cargan los datos
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          onSearch={buscarPorNombre}
          placeholder="Buscar banda por nombre..."
        />
        
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-all"
          onClick={openAgregar}
        >
          + Agregar Banda Real
        </button>
      </div>

      <ModalAgregar
        isOpen={showAgregar}
        onClose={closeAgregar}
        onAdd={agregarBanda}
        form={form}
        setForm={setForm}
        title="Agregar Banda Real"
      />

      <ModalEditar
        isOpen={showEditar}
        onClose={closeEditar}
        form={editForm}
        setForm={setEditForm}
        onUpdate={actualizarBanda}
        title="Editar Banda Real"
      />

      <ModalConfirmar
        isOpen={showConfirmar}
        onClose={closeConfirmar}
        onConfirm={eliminarBanda}
        nombre={bandaToDelete?.nombre}
      />

      {bandas.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No se encontraron bandas reales. ¡Agrega una nueva!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bandas.map((banda) => (
            <BandaCard
              key={banda._id}
              item={banda}
              isReal={true}
              onEdit={openEditar}
              onDelete={openConfirmar}
            />
          ))}
        </div>
      )}
    </div>
  );
}