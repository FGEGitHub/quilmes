import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";

import SocioEditar from "./componenteficha";
import SocioResumen from "./cuotas";

/* ---------------- SECCIONES ---------------- */

const sections = [
  {
    id: 0,
    label: "Datos del Socio",
    icon: <EditIcon />,
  },
  {
    id: 1,
    label: "Cuotas",
    icon: <PaymentIcon />,
  },
];

/* ---------------- COMPONENTE ---------------- */

const SocioMenu = () => {
  const [activeSection, setActiveSection] = useState(0);

  /* ---------- USER CONTEXT ---------- */

  const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");

  let userContext = null;

  if (loggedUserJSON) {
    try {
      userContext = JSON.parse(loggedUserJSON);
    } catch {
      window.localStorage.removeItem("loggedNoteAppUser");
    }
  }

  const isNivel2 = userContext?.nivel === "2";

  /* ---------- CONTENIDO ---------- */

  const renderContent = () => {
    switch (activeSection) {
      case 0:
        return <SocioEditar />;

      case 1:
        return <SocioResumen />;

      default:
        return null;
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        pt: 5,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 1300,
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* HEADER */}
        <Box mb={4} textAlign="center">
          <Typography variant="h4" fontWeight="bold">
            Gestión de Socio
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Administración de datos y cuotas
          </Typography>
        </Box>

        {/* TABS */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
            borderBottom: "2px solid #eee",
          }}
        >
          {sections.map((sec) => {
            const active = activeSection === sec.id;

            // 🔒 Bloquear Cuotas si no es nivel 2
            const disabled = sec.id === 1 && !isNivel2;

            return (
              <Tooltip
                key={sec.id}
                title={
                  disabled
                    ? "Solo usuarios nivel 2 pueden acceder a Cuotas"
                    : ""
                }
              >
                <Box
                  onClick={() => {
                    if (!disabled) {
                      setActiveSection(sec.id);
                    }
                  }}
                  sx={{
                    cursor: disabled ? "not-allowed" : "pointer",
                    px: 4,
                    py: 2,
                    mx: 1,
                    textAlign: "center",

                    borderBottom: active
                      ? "3px solid #1976d2"
                      : "3px solid transparent",

                    transition: "all 0.2s",

                    opacity: disabled ? 0.4 : 1,

                    "&:hover": disabled
                      ? {}
                      : {
                          backgroundColor: "#f5f5f5",
                        },
                  }}
                >
                  {/* ICONO */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mb: 0.5,
                      color: active
                        ? "primary.main"
                        : "text.secondary",
                    }}
                  >
                    {sec.icon}
                  </Box>

                  {/* TEXTO */}
                  <Typography
                    fontWeight={active ? "bold" : "normal"}
                    color={
                      active
                        ? "primary"
                        : "text.secondary"
                    }
                  >
                    {sec.label}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* CONTENIDO */}
        <Box minHeight="500px">
          {renderContent()}
        </Box>
      </Paper>
    </Box>
  );
};

export default SocioMenu;
