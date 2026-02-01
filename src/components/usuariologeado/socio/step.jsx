import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";

import SocioEditar from "./componenteficha";
import SocioResumen from "./cuotas";

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

const SocioMenu = () => {
  const [activeSection, setActiveSection] = useState(0);

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
          maxWidth: 1100,
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

            return (
              <Box
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                sx={{
                  cursor: "pointer",
                  px: 4,
                  py: 2,
                  mx: 1,
                  textAlign: "center",
                  borderBottom: active
                    ? "3px solid #1976d2"
                    : "3px solid transparent",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 0.5,
                    color: active ? "primary.main" : "text.secondary",
                  }}
                >
                  {sec.icon}
                </Box>

                <Typography
                  fontWeight={active ? "bold" : "normal"}
                  color={active ? "primary" : "text.secondary"}
                >
                  {sec.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* CONTENIDO */}
        <Box minHeight="400px">
          {renderContent()}
        </Box>
      </Paper>
    </Box>
  );
};

export default SocioMenu;
