export default function SearchBar({ value, onChange, onSearch, placeholder }) {
  return (
    <div className="relative w-full sm:w-64">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-4 pr-10 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
      />
      <button 
        onClick={onSearch}
        className="absolute right-2 top-2 text-gray-400 hover:text-white"
      >
        🔍
      </button>
    </div>
  );
}