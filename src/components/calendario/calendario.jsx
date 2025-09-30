import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { parse, format } from "date-fns";
import { es } from "date-fns/locale";
import eventosData from "../../data/eventos.json";
import "./Calendario.css";

// 🎯 Íconos
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsHockeyIcon from "@mui/icons-material/SportsHockey";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";

const Calendario = () => {
  const [value, setValue] = useState(new Date());
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  useEffect(() => {
    setEventos(eventosData);
  }, []);

  // 🔹 Formato para comparar fechas
  const formatearFecha = (fecha) =>
    format(parse(fecha, "dd/MM/yyyy", new Date()), "yyyy-MM-dd");

  const eventosPorFecha = {};
  eventos.forEach((ev) => {
    const key = formatearFecha(ev.fecha);
    if (!eventosPorFecha[key]) eventosPorFecha[key] = [];
    eventosPorFecha[key].push(ev);
  });

  const handleClickDay = (date) => {
    const key = format(date, "yyyy-MM-dd");
    setEventoSeleccionado(eventosPorFecha[key] || []);
  };

  // 🔹 Función para elegir ícono y color
  const getIconoDeporte = (ev) => {
    const estilo = { fontSize: 22 };

    if (ev.deporte.toLowerCase().includes("futbol")) {
      estilo.color = ev.deporte.toLowerCase().includes("femenino") ? "deeppink" : "dodgerblue";
      return <SportsSoccerIcon style={estilo} />;
    }

    if (ev.deporte.toLowerCase().includes("hockey")) {
      estilo.color = ev.deporte.toLowerCase().includes("femenino") ? "deeppink" : "dodgerblue";
      return <SportsHockeyIcon style={estilo} />;
    }

    if (ev.deporte.toLowerCase().includes("cesto")) {
      estilo.color = "orange";
      return <SportsVolleyballIcon style={estilo} />;
    }

    return null;
  };

  return (
    <div className="calendario-container">
      <Calendar
        onChange={setValue}
        value={value}
        locale={es}
        onClickDay={handleClickDay}
        tileContent={({ date }) => {
          const key = format(date, "yyyy-MM-dd");
          const eventosDia = eventosPorFecha[key];
          return eventosDia ? (
            <div className="iconos">
              {eventosDia.map((ev, i) => (
                <span key={i} title={ev.evento}>
                  {getIconoDeporte(ev)}
                </span>
              ))}
            </div>
          ) : null;
        }}
      />

      {/* 🔹 Detalle de eventos del día */}
      {eventoSeleccionado && eventoSeleccionado.length > 0 && (
        <div className="evento-detalle">
          <h3>Eventos del {format(value, "dd/MM/yyyy")}</h3>
          <ul>
            {eventoSeleccionado.map((ev, i) => (
              <li key={i}>
                <strong>{ev.evento}</strong> <br />
                {ev.detalle}{" "}
                {ev.categoria ? (
                  <span style={{ fontWeight: "bold" }}>({ev.categoria})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calendario;
