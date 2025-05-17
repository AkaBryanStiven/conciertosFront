export default function BandaCard({ item, isReal = false, onEdit, onDelete }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-bold text-green-400">{item.nombre}</h3>
      {!isReal && (
        <p className="text-sm text-gray-400">Inspirada en: {item.nombre_inspirado_en}</p>
      )}
      {isReal && (
        <p className="text-sm text-gray-400">Género: {item.genero}</p>
      )}
      
      <div className="mt-2 space-y-1">
        <p>
          <span className="font-semibold">Origen:</span> {isReal ? item.pais_origen : item.ciudad_origen}
        </p>
        <p>
          <span className="font-semibold">Años:</span> {isReal ? item.año_formacion : item.años_activos}
        </p>
        {isReal && (
          <p>
            <span className="font-semibold">Miembros:</span> {item.miembros_fundadores?.join(', ')}
          </p>
        )}
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