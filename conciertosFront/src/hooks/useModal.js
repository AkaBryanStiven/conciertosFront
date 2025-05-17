import { useState } from 'react';

export function useModal(initialData = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item = null) => {
    setSelectedItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData(initialData); // Resetear al formulario inicial cuando no hay item
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedItem(null);
    setFormData(initialData);
  };

  return {
    isOpen,
    formData,
    setFormData,
    selectedItem,
    openModal,
    closeModal,
    initialData
  };
}