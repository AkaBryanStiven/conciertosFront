export default function SectionSwitcher({ sections, currentIndex, onChange }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <button
        onClick={() => onChange((prev) => (prev - 1 + sections.length) % sections.length)}
        className="text-2xl bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full transition-all"
      >
        ←
      </button>
      
      <h2 className="text-xl font-bold text-center capitalize">
        {sections[currentIndex].label}
      </h2>
      
      <button
        onClick={() => onChange((prev) => (prev + 1) % sections.length)}
        className="text-2xl bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full transition-all"
      >
        →
      </button>
    </div>
  );
}