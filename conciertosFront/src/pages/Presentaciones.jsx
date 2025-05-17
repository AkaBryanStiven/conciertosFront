import { useState } from "react";
import { useModal } from "../hooks/useModal";
import { useFetchData } from "../hooks/useFetchData";
import PresentacionCard from "../components/cards/PresentacionCard";
import ModalAgregar from "../components/modals/ModalAgregar";
import ModalEditar from "../components/modals/ModalEditar";
import ModalConfirmar from "../components/modals/ModalConfirmar";
import SearchBar from "../components/shared/SearchBar";

const defaultForm = {
  idBanda: "",
  idCancion: "",
  lugar: "",
  fecha: "",
  publico_aproximado: 0,
  duracion_minutos: 0,
  sonido_fallo: false,
  guitarrista_rompio_cuerda: false,
  rating_publico: 0
};

export default function Presentaciones() {
  const { data: presentaciones, refetch } = useFetchData("presentaciones/obtenerTodas");
  const [busquedaLugar, setBusquedaLugar] = useState("");
  
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
    selectedItem: selectedPresentacion,
    openModal: openEditar,
    closeModal: closeEditar,
  } = useModal(defaultForm);
  
  const {
    isOpen: showConfirmar,
    selectedItem: presentacionToDelete,
    openModal: openConfirmar,
    closeModal: closeConfirmar,
  } = useModal();

  const buscarPorLugar = async () => {
    if (!busquedaLugar.trim()) {
      refetch();
      return;
    }
    try {
      const res = await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/presentaciones/porLugar/${busquedaLugar}`
      );
      const data = await res.json();
      setPresentaciones(data);
    } catch (error) {
      console.error("Error al buscar presentaciones:", error);
    }
  };

  const agregarPresentacion = async () => {
    try {
      await fetch(
        "https://conciertosback.onrender.com/conciertosBaraticos/presentaciones/agregar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      closeAgregar();
      refetch();
    } catch (error) {
      console.error("Error al agregar presentación:", error);
    }
  };

  const actualizarPresentacion = async () => {
    try {
      const { idBanda, idCancion, fecha } = selectedPresentacion;
      await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/presentaciones/actualizar/${idBanda}/${idCancion}/${fecha}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );
      closeEditar();
      refetch();
    } catch (error) {
      console.error("Error al editar presentación:", error);
    }
  };

  const eliminarPresentacion = async () => {
    try {
      const { idBanda, idCancion, fecha } = presentacionToDelete;
      await fetch(
        `https://conciertosback.onrender.com/conciertosBaraticos/presentaciones/eliminar/${idBanda}/${idCancion}/${fecha}`,
        {
          method: "DELETE",
        }
      );
      closeConfirmar();
      refetch();
    } catch (error) {
      console.error("Error al eliminar presentación:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <SearchBar
          value={busquedaLugar}
          onChange={setBusquedaLugar}
          onSearch={buscarPorLugar}
          placeholder="Buscar por lugar..."
        />
        
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-all"
          onClick={openAgregar}
        >
          + Agregar Presentación
        </button>
      </div>

      <ModalAgregar
        isOpen={showAgregar}
        onClose={closeAgregar}
        onAdd={agregarPresentacion}
        form={form}
        setForm={setForm}
        title="Agregar Presentación"
      />

      <ModalEditar
        isOpen={showEditar}
        onClose={closeEditar}
        form={editForm}
        setForm={setEditForm}
        onUpdate={actualizarPresentacion}
        title="Editar Presentación"
      />

      <ModalConfirmar
        isOpen={showConfirmar}
        onClose={closeConfirmar}
        onConfirm={eliminarPresentacion}
        nombre={`presentación en ${presentacionToDelete?.lugar}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presentaciones.map((presentacion) => (
          <PresentacionCard
            key={`${presentacion.idBanda}-${presentacion.idCancion}-${presentacion.fecha}`}
            item={presentacion}
            onEdit={openEditar}
            onDelete={openConfirmar}
          />
        ))}
      </div>
    </div>
  );
}