export default function CancionCard({ item, onEdit, onDelete }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-bold text-purple-400">{item.titulo}</h3>
      <p className="text-sm text-gray-400">{item.banda_original} ({item.año_lanzamiento})</p>
      
      <div className="mt-2 space-y-1">
        <p><span className="font-semibold">Género:</span> {item.genero}</p>
        <p><span className="font-semibold">Duración:</span> {item.duracion_segundos} seg</p>
        <p><span className="font-semibold">Versiones:</span> {item.veces_versionada}</p>
      </div>
      
      <div className="flex justify-end mt-4 space-x-2">
        <button 
          onClick={() => onEdit(item)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
        >
          Editar
        </button>
        <button 
          onClick={() => onDelete(item)}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}