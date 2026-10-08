
import React from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";

const Indumentaria = () => {
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
            Indumentaria
          </Typography>

          <Typography
            sx={{
              color: "#6d778a",
              marginTop: "5px",
            }}
          >
            Pedidos, entregas, cobros y saldos pendientes.
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
          + Nuevo pedido
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
        {[
          {
            label: "Total vendido",
            value: "$640.000",
          },
          {
            label: "Cobrado",
            value: "$455.000",
          },
          {
            label: "Pendiente",
            value: "$185.000",
          },
          {
            label: "Pedidos pendientes",
            value: "7",
          },
        ].map((item) => (
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
                color: "#172033",
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* PEDIDOS */}
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 900,
          margin: "25px 0 12px",
          color: "#172033",
        }}
      >
        Pedidos recientes
      </Typography>

      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #e3e8f1",
          borderRadius: "17px",
          padding: "18px",
        }}
      >
        {/* PEDIDO 1 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            padding: "12px 0",
            borderBottom: "1px solid #e3e8f1",

            "@media (max-width: 600px)": {
              alignItems: "flex-start",
              flexDirection: "column",
            },
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700 }}>
              Ramírez, Santino
            </Typography>

            <Typography
              sx={{
                color: "#6d778a",
                fontSize: 13,
                marginTop: "4px",
              }}
            >
              Conjunto · Talle 14 · $45.000
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: "#fff3dc",
              color: "#b87808",
              fontSize: 12,
              fontWeight: 800,
              borderRadius: "20px",
              padding: "5px 9px",
              whiteSpace: "nowrap",
            }}
          >
            Debe $20.000
          </Box>
        </Box>

        {/* PEDIDO 2 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            padding: "12px 0",

            "@media (max-width: 600px)": {
              alignItems: "flex-start",
              flexDirection: "column",
            },
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700 }}>
              Niz, Jonatan
            </Typography>

            <Typography
              sx={{
                color: "#6d778a",
                fontSize: 13,
                marginTop: "4px",
              }}
            >
              Camiseta · Talle M · $30.000
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: "#e8f7ef",
              color: "#178a52",
              fontSize: 12,
              fontWeight: 800,
              borderRadius: "20px",
              padding: "5px 9px",
              whiteSpace: "nowrap",
            }}
          >
            Pagado
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Indumentaria;

