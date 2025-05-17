import { Dialog } from "@headlessui/react";

export default function ModalAgregar({ 
  isOpen, 
  onClose, 
  onAdd, 
  form, 
  setForm, 
  title 
}) {
  const handleArrayChange = (field, value) => {
    setForm({
      ...form,
      [field]: value.split(',').map(item => item.trim())
    });
  };

  const renderField = (key) => {
    const label = key.replace(/_/g, ' ');
    
    if (typeof form[key] === 'boolean') {
      return (
        <div key={key} className="space-y-1">
          <label className="block text-sm font-medium text-gray-300 capitalize">
            {label}
          </label>
          <select
            className="w-full bg-gray-700 text-white rounded p-2"
            value={form[key]}
            onChange={(e) => setForm({ 
              ...form, 
              [key]: e.target.value === 'true' 
            })}
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
      );
    }

    if (Array.isArray(form[key])) {
      return (
        <div key={key} className="space-y-1">
          <label className="block text-sm font-medium text-gray-300 capitalize">
            {label} (separar por comas)
          </label>
          <input
            type="text"
            className="w-full bg-gray-700 text-white rounded p-2"
            value={form[key].join(', ')}
            onChange={(e) => handleArrayChange(key, e.target.value)}
          />
        </div>
      );
    }

    return (
      <div key={key} className="space-y-1">
        <label className="block text-sm font-medium text-gray-300 capitalize">
          {label}
        </label>
        <input
          type={typeof form[key] === 'number' ? 'number' : 'text'}
          className="w-full bg-gray-700 text-white rounded p-2"
          value={form[key]}
          onChange={(e) => setForm({ 
            ...form, 
            [key]: typeof form[key] === 'number' 
              ? parseInt(e.target.value) || 0 
              : e.target.value 
          })}
        />
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl">
          <Dialog.Title className="text-xl font-bold text-white mb-4">
            {title}
          </Dialog.Title>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {Object.keys(form).map(renderField)}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onAdd}
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white transition-colors"
            >
              Agregar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}