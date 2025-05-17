import { Dialog } from "@headlessui/react";

export default function ModalConfirmar({ 
  isOpen, 
  onClose, 
  onConfirm, 
  nombre 
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-lg bg-gray-800 p-6 shadow-xl text-center">
          <Dialog.Title className="text-xl font-bold text-white mb-4">
            Confirmar Eliminación
          </Dialog.Title>
          
          <p className="mb-4 text-gray-300">
            ¿Estás seguro de eliminar <span className="font-semibold text-white">{nombre}</span>?
          </p>
          <p className="mb-6 text-sm text-gray-400">
            Esta acción no se puede deshacer.
          </p>

          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white transition-colors"
            >
              Eliminar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}