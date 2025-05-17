import Home from "./pages/Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="bg-black py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">🎸 Conciertos Baráticos 🎶</h1>
        </div>
      </header>
      <Home />
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;