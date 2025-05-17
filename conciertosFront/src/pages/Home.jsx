import { useState } from "react";
import SectionSwitcher from "../components/shared/SectionSwitcher";
import BandasCover from "./BandasCover";
import CancionesReales from "./CancionesReales";
import Presentaciones from "./Presentaciones";
import BandasReales from "./BandasReales";
import Discografias from "./Discografias";
import EventosMusicales from "./EventosMusicales";

const SECTIONS = [
  { label: "Bandas Cover", component: <BandasCover /> },
  { label: "Canciones Reales", component: <CancionesReales /> },
  { label: "Presentaciones", component: <Presentaciones /> },
  { label: "Bandas Reales", component: <BandasReales /> },
  { label: "Discografías", component: <Discografias /> },
  { label: "Eventos Musicales", component: <EventosMusicales /> }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionSwitcher 
        sections={SECTIONS} 
        currentIndex={currentIndex} 
        onChange={setCurrentIndex} 
      />
      
      {SECTIONS[currentIndex].component}
    </div>
  );
}