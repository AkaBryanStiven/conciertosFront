import { useState } from "react";
import { useModal } from "../hooks/useModal";
import { useFetchData } from "../hooks/useFetchData";
import BandaCard from "../components/cards/BandaCard";
import ModalAgregar from "../components/modals/ModalAgregar";
import ModalEditar from "../components/modals/ModalEditar";
import ModalConfirmar from "../components/modals/ModalConfirmar";
import SearchBar from "../components/shared/SearchBar";


const defaultForm = {
  nombre: "",
  nombre_inspirado_en: "",
  ciudad_origen: "",
  años_activos: 0,
  num_integrantes: 0,
  integrantes_resaca: false,
  tiene_triángulo: false,
  nombre_fanbase: "",
  veces_olvidaron_la_letra: 0,
  porcentaje_similitud_con_original: 0
};

export default function BandasCover() {
  const { data: bandas, refetch } = useFetchData("bandas/obtenerTodas");
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
        `https://conciertosback.onrender.com/conciertosBaraticos/bandas/obtenerPorNombre/${busqueda}`
      );
      const data = await res.json();
      setBandas(data);
    } catch (error) {
      console.error("Error al buscar banda:", error);
    }
  };

  const agregarBanda = async () => {
    try {
      await fetch(
        "https://conciertosback.onrender.com/conciertosBaraticos/bandas/agregar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      closeAgregar();
      refetch();
    } catch (error) {
      console.error("Error al agregar banda:", error);
    }
  };

  const actualizarBanda = async () => {
    try {
      await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/bandas/editar/${selectedBanda.idBanda}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );
      closeEditar();
      refetch();
    } catch (error) {
      console.error("Error al editar banda:", error);
    }
  };

  const eliminarBanda = async () => {
    try {
      await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/bandas/eliminar/${bandaToDelete.idBanda}`,
        {
          method: "DELETE",
        }
      );
      closeConfirmar();
      refetch();
    } catch (error) {
      console.error("Error al eliminar banda:", error);
    }
  };

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
          + Agregar Banda
        </button>
      </div>

      <ModalAgregar
        isOpen={showAgregar}
        onClose={closeAgregar}
        onAdd={agregarBanda}
        form={form}
        setForm={setForm}
        title="Agregar Banda Cover"
      />

      <ModalEditar
        isOpen={showEditar}
        onClose={closeEditar}
        form={editForm}
        setForm={setEditForm}
        onUpdate={actualizarBanda}
        title="Editar Banda Cover"
      />

      <ModalConfirmar
        isOpen={showConfirmar}
        onClose={closeConfirmar}
        onConfirm={eliminarBanda}
        nombre={bandaToDelete?.nombre}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bandas.map((banda) => (
          <BandaCard
            key={banda.idBanda}
            item={banda}
            onEdit={openEditar}
            onDelete={openConfirmar}
          />
        ))}
      </div>
    </div>
  );
}