
import React from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const MenuClub = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const opciones = [
    {
      id: "inicio",
      nombre: "Inicio",
      icono: "⌂",
      path: "/usuario/inicio",
    },
    {
      id: "jugadores",
      nombre: "Jugadores",
      icono: "⚽",
      path: "/usuario/socios",
    },
    {
      id: "socios",
      nombre: "Socios",
      icono: "👥",
      path: "/usuario/socios",
    },
    {
      id: "cobros",
      nombre: "Cobros",
      icono: "💳",
      path: "/usuario/cobros",
    },
    {
      id: "indumentaria",
      nombre: "Indumentaria",
      icono: "👕",
      path: "/usuario/indumentaria",
    },
    {
      id: "caja",
      nombre: "Caja",
      icono: "💰",
      path: "/usuario/caja",
    },
    {
      id: "partidos",
      nombre: "Partidos",
      icono: "🏟",
      path: "/usuario/partidos",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f6f8fc",

        "@media (max-width: 850px)": {
          flexDirection: "column",
        },
      }}
    >
      {/* =========================
          MENU IZQUIERDO
      ========================= */}
      <Box
        sx={{
          width: 230,
          minWidth: 230,
          backgroundColor: "#fff",
          borderRight: "1px solid #e3e8f1",
          minHeight: "100vh",
          padding: "24px 16px",

          "@media (max-width: 850px)": {
            width: "100%",
            minWidth: "100%",
            minHeight: "auto",
            borderRight: "none",
            borderBottom: "1px solid #e3e8f1",
            padding: "12px",
          },
        }}
      >
        {/* NOMBRE DEL CLUB */}
        <Box
          sx={{
            margin: "0 10px 26px",

            "@media (max-width: 850px)": {
              margin: "5px 8px 12px",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 900,
              color: "#1849a9",
            }}
          >
            QUILMES
          </Typography>

          <Typography
            sx={{
              color: "#6d778a",
              fontSize: 11,
              letterSpacing: ".13em",
            }}
          >
            GESTIÓN DEL CLUB
          </Typography>
        </Box>

        {/* MENU */}
        <Box
          sx={{
            display: "grid",
            gap: "7px",

            "@media (max-width: 850px)": {
              display: "flex",
              overflowX: "auto",
            },
          }}
        >
          {opciones.map((opcion) => {
            const activo = location.pathname === opcion.path;

            return (
              <Button
                key={opcion.id}
                onClick={() => navigate(opcion.path)}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  textTransform: "none",
                  borderRadius: "12px",
                  padding: "12px 14px",

                  color: activo ? "#1849a9" : "#4f5a6e",
                  backgroundColor: activo ? "#eef4ff" : "transparent",

                  fontWeight: activo ? 600 : 400,
                  minWidth: "auto",

                  "&:hover": {
                    backgroundColor: "#eef4ff",
                    color: "#1849a9",
                  },

                  "@media (max-width: 850px)": {
                    whiteSpace: "nowrap",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 28,
                    fontSize: 17,
                  }}
                >
                  {opcion.icono}
                </Box>

                {opcion.nombre}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* =========================
          CONTENIDO
      ========================= */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MenuClub;

