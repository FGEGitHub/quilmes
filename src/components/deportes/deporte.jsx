import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  Card,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion, AnimatePresence } from "framer-motion";
import "./Deporte.css";

import escudo from "../../assets/quilmes.jpeg";
import eventosData from "../../data/eventos.json";

const normalizarNombre = (nombre) =>
  nombre.toLowerCase().replace(/\s+/g, "-"); // Gonzalo Brites → gonzalo-brites

const Deporte = () => {
  const { deporte } = useParams(); // ej: "futbol-masculino"
  const [jugadores, setJugadores] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [jugadorSel, setJugadorSel] = useState(null);
  const [partidoSel, setPartidoSel] = useState(null);
  const [imagenActual, setImagenActual] = useState(escudo);

  useEffect(() => {
    // Importar dinámico del JSON del deporte
    import(`../../data/${deporte}.json`)
      .then((data) => setJugadores(data.default || data))
      .catch((err) => console.error("Error cargando jugadores:", err));

    // Filtrar partidos por deporte
    setPartidos(eventosData.filter((e) => e.deporte === deporte));
  }, [deporte]);

const handleJugadorSelect = (j) => {
  setJugadorSel(j);

  const basePath = `/assets/jugadores/${normalizarNombre(j.Nombre)}`;
  const posiblesExtensiones = [".jpeg", ".jpg", ".png"];

  // probamos rutas
  let imgUrl = null;
  for (let ext of posiblesExtensiones) {
    const testUrl = `${basePath}${ext}`;
    // no podemos verificar si existe con require, pero sí con carga dinámica
    imgUrl = testUrl;
    break;
  }

  setImagenActual(imgUrl || escudo);
};

  return (
    <section className="deporte-section">
      {/* Imagen con transición */}
      <div className="deporte-image">
        <AnimatePresence mode="wait">
         <motion.img
  key={imagenActual}
  src={imagenActual}
  alt="Imagen jugador o escudo"
  className="escudo-img"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
  onError={(e) => (e.target.src = escudo)}
/>

        </AnimatePresence>
        
        {/* Info jugador */}
  
      </div>
      {jugadorSel && (
          <Card className="deporte-card">
            <CardContent>
              <Typography variant="h6">{jugadorSel.Nombre} {jugadorSel.apodo && " Apodo: "+jugadorSel.apodo }</Typography>
              <Typography>Posición: {jugadorSel.posicion}</Typography>
              <Typography>Pierna hábil: {jugadorSel.pierna_habil}</Typography>
              <Typography>
                Nacimiento:{" "}
                {new Date(jugadorSel.fecha_nacimiento).toLocaleDateString()}
              </Typography>
              <Typography>Categoría: {jugadorSel.categoria}</Typography>
            </CardContent>
          </Card>
        )}
      {/* Contenido */}
      <div className="deporte-content">
        <h2>🏆 {deporte.replace("-", " ").toUpperCase()}</h2>

        {/* Acordeón Jugadores */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Jugadores</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {jugadores.map((j, idx) => (
                <ListItemButton
                  key={idx}
                  onClick={() => handleJugadorSelect(j)}
                  selected={jugadorSel?.Nombre === j.Nombre}
                >
                  {j.Nombre} ({j.categoria})
                </ListItemButton>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>


        {/* Acordeón Partidos */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Partidos</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {partidos.map((p, idx) => (
                <ListItemButton
                  key={idx}
                  onClick={() => setPartidoSel(p)}
                  selected={partidoSel?.evento === p.evento}
                >
                  {p.evento} ({p.fecha})
                </ListItemButton>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Info partido */}
        {partidoSel && (
          <Card className="deporte-card">
            <CardContent>
              <Typography variant="h6">{partidoSel.evento}</Typography>
              <Typography>Detalle: {partidoSel.detalle}</Typography>
              <Typography>Fecha: {partidoSel.fecha}</Typography>
              <Typography>Categoría: {partidoSel.categoria}</Typography>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default Deporte;
