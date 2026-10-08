
import React from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";

const Caja = () => {
  const metricas = [
    {
      label: "Ingresos",
      value: "$3,25 M",
    },
    {
      label: "Egresos",
      value: "$1,87 M",
    },
    {
      label: "Resultado",
      value: "+$1,38 M",
      positivo: true,
    },
    {
      label: "Gastos fijos pendientes",
      value: "$210.000",
    },
  ];

  return (
    <Box
      sx={{
        padding: "28px",
        maxWidth: "1280px",
        width: "100%",
        margin: "auto",

        "@media (max-width: 850px)": {
          padding: "18px",
        },
      }}
    >
      {/* ENCABEZADO */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "15px",
          marginBottom: "24px",

          "@media (max-width: 600px)": {
            flexDirection: "column",
            alignItems: "flex-start",
          },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              color: "#172033",
            }}
          >
            Caja
          </Typography>

          <Typography
            sx={{
              color: "#6d778a",
              marginTop: "5px",
            }}
          >
            Ingresos y egresos reales del club en un único lugar.
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1849a9",
            borderRadius: "10px",
            padding: "9px 12px",
            fontWeight: 800,
            textTransform: "none",

            "&:hover": {
              backgroundColor: "#0f3d91",
            },
          }}
        >
          + Movimiento
        </Button>
      </Box>

      {/* MÉTRICAS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",

          "@media (max-width: 850px)": {
            gridTemplateColumns: "repeat(2, 1fr)",
          },

          "@media (max-width: 480px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        {metricas.map((item) => (
          <Box
            key={item.label}
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #e3e8f1",
              borderRadius: "17px",
              padding: "18px",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: "#6d778a",
              }}
            >
              {item.label}
            </Typography>

            <Typography
              sx={{
                fontSize: 27,
                fontWeight: 900,
                margin: "4px 0",
                color: item.positivo ? "#178a52" : "#172033",
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* MOVIMIENTOS */}
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 900,
          margin: "25px 0 12px",
          color: "#172033",
        }}
      >
        Últimos movimientos
      </Typography>

      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #e3e8f1",
          borderRadius: "17px",
          padding: "18px",
        }}
      >
        {[
          {
            nombre: "Cuota · Ayala Ismael",
            monto: "+$15.000",
            positivo: true,
          },
          {
            nombre: "Sponsor · Supermercado Norte",
            monto: "+$150.000",
            positivo: true,
          },
          {
            nombre: "Árbitros · Sub 17",
            monto: "−$80.000",
            positivo: false,
          },
          {
            nombre: "Mantenimiento",
            monto: "−$35.000",
            positivo: false,
          },
        ].map((movimiento, index, array) => (
          <Box
            key={movimiento.nombre}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              padding: "12px 0",
              borderBottom:
                index !== array.length - 1
                  ? "1px solid #e3e8f1"
                  : "none",
            }}
          >
            <Typography>
              {movimiento.nombre}
            </Typography>

            <Typography
              sx={{
                fontWeight: 900,
                color: movimiento.positivo
                  ? "#178a52"
                  : "#c43c45",
              }}
            >
              {movimiento.monto}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Caja;

