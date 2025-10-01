import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import "./futbol-m.css";
import escudo from "../../assets/quilmes.jpeg";
import jugadoresData from "../../data/futbol-masculino.json";
import eventosData from "../../data/eventos.json";

const Futbol = () => {
  const [jugadores, setJugadores] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [jugadorSel, setJugadorSel] = useState("");
  const [partidoSel, setPartidoSel] = useState("");

  useEffect(() => {
    // Filtramos los JSON para este deporte
    const jugFiltrados = jugadoresData.filter(
      (j) => j.deporte === "futbol-masculino"
    );
    const partFiltrados = eventosData.filter(
      (e) => e.deporte === "futbol-masculino"
    );

    setJugadores(jugFiltrados);
    setPartidos(partFiltrados);
  }, []);

  return (
    <section className="futbol-section">
      <div className="futbol-image">
        <img src={escudo} alt="Escudo Club Quilmes" />
      </div>

      <div className="futbol-content">
        <h2>⚽ Fútbol Masculino</h2>

        <Card className="futbol-card">
          <CardContent>
            <FormControl fullWidth>
              <InputLabel>Seleccionar Jugador</InputLabel>
              <Select
                value={jugadorSel}
                onChange={(e) => setJugadorSel(e.target.value)}
              >
                {jugadores.map((j, idx) => (
                  <MenuItem key={idx} value={j.Nombre}>
                    {j.Nombre} ({j.categoria})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {jugadorSel && (
              <div className="futbol-detalle">
                {jugadores
                  .filter((j) => j.Nombre === jugadorSel)
                  .map((j, idx) => (
                    <Typography key={idx} variant="body1">
                      <strong>Posición:</strong> {j.posicion} <br />
                      <strong>Pierna hábil:</strong> {j.pierna_habil} <br />
                      <strong>Fecha de nacimiento:</strong>{" "}
                      {new Date(j.fecha_nacimiento).toLocaleDateString()} <br />
                      <strong>Categoría:</strong> {j.categoria}
                    </Typography>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="futbol-card">
          <CardContent>
            <FormControl fullWidth>
              <InputLabel>Seleccionar Partido</InputLabel>
              <Select
                value={partidoSel}
                onChange={(e) => setPartidoSel(e.target.value)}
              >
                {partidos.map((p, idx) => (
                  <MenuItem key={idx} value={p.evento}>
                    {p.evento} ({p.fecha})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {partidoSel && (
              <div className="futbol-detalle">
                {partidos
                  .filter((p) => p.evento === partidoSel)
                  .map((p, idx) => (
                    <Typography key={idx} variant="body1">
                      <strong>Evento:</strong> {p.evento} <br />
                      <strong>Detalle:</strong> {p.detalle} <br />
                      <strong>Fecha:</strong> {p.fecha} <br />
                      <strong>Categoría:</strong> {p.categoria}
                    </Typography>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Futbol;
