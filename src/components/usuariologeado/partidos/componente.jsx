
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

const Partidos = () => {
  const [open, setOpen] = useState(false);

  const partidos = [
    {
      id: 1,
      categoria: "Fútbol · Sub 17",
      rival: "Mandiyú",
      fecha: "12/10/2026",
      recaudacion: "$330.000",
      gastos: "$230.000",
      resultado: "$100.000",
    },
    {
      id: 2,
      categoria: "Fútbol · Sub 15",
      rival: "Montaña",
      fecha: "05/10/2026",
      recaudacion: "$275.220",
      gastos: "$230.000",
      resultado: "$45.220",
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
      {/* =========================
          ENCABEZADO
      ========================= */}
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
            Partidos y recaudaciones
          </Typography>

          <Typography
            sx={{
              color: "#6d778a",
              marginTop: "5px",
            }}
          >
            Cada partido concentra recaudación,
            gastos y resultado neto.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
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
          + Nuevo partido
        </Button>
      </Box>

      {/* =========================
          RESUMEN
      ========================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          marginBottom: "25px",

          "@media (max-width: 850px)": {
            gridTemplateColumns: "repeat(2, 1fr)",
          },

          "@media (max-width: 480px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #e3e8f1",
            borderRadius: "17px",
            padding: "18px",
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#6d778a" }}>
            Partidos registrados
          </Typography>

          <Typography
            sx={{
              fontSize: 27,
              fontWeight: 900,
              marginTop: "4px",
            }}
          >
            2
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #e3e8f1",
            borderRadius: "17px",
            padding: "18px",
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#6d778a" }}>
            Recaudación
          </Typography>

          <Typography
            sx={{
              fontSize: 27,
              fontWeight: 900,
              marginTop: "4px",
            }}
          >
            $605.220
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #e3e8f1",
            borderRadius: "17px",
            padding: "18px",
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#6d778a" }}>
            Gastos
          </Typography>

          <Typography
            sx={{
              fontSize: 27,
              fontWeight: 900,
              marginTop: "4px",
            }}
          >
            $460.000
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #e3e8f1",
            borderRadius: "17px",
            padding: "18px",
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#6d778a" }}>
            Resultado neto
          </Typography>

          <Typography
            sx={{
              fontSize: 27,
              fontWeight: 900,
              marginTop: "4px",
              color: "#178a52",
            }}
          >
            +$145.220
          </Typography>
        </Box>
      </Box>

      {/* =========================
          TÍTULO
      ========================= */}
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 900,
          marginBottom: "12px",
          color: "#172033",
        }}
      >
        Partidos recientes
      </Typography>

      {/* =========================
          PARTIDOS
      ========================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "14px",

          "@media (max-width: 850px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        {partidos.map((partido) => (
          <Box
            key={partido.id}
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #e3e8f1",
              borderRadius: "17px",
              padding: "18px",
            }}
          >
            {/* CATEGORÍA */}
            <Typography
              sx={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: ".1em",
                color: "#6d778a",
                fontWeight: 800,
              }}
            >
              {partido.categoria}
            </Typography>

            {/* PARTIDO */}
            <Typography
              sx={{
                fontSize: 23,
                fontWeight: 800,
                color: "#172033",
                marginTop: "5px",
              }}
            >
              Quilmes vs. {partido.rival}
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: "#6d778a",
                marginTop: "4px",
                marginBottom: "12px",
              }}
            >
              {partido.fecha}
            </Typography>

            {/* RECAUDACIÓN */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                padding: "12px 0",
                borderBottom: "1px solid #e3e8f1",
              }}
            >
              <Typography>
                Recaudación
              </Typography>

              <Typography fontWeight={700}>
                {partido.recaudacion}
              </Typography>
            </Box>

            {/* GASTOS */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                padding: "12px 0",
                borderBottom: "1px solid #e3e8f1",
              }}
            >
              <Typography>
                Gastos
              </Typography>

              <Typography fontWeight={700}>
                {partido.gastos}
              </Typography>
            </Box>

            {/* RESULTADO */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                padding: "12px 0",
              }}
            >
              <Typography>
                Resultado neto
              </Typography>

              <Typography
                sx={{
                  fontWeight: 900,
                  color: "#178a52",
                }}
              >
                +{partido.resultado}
              </Typography>
            </Box>

            {/* BOTÓN */}
            <Button
              variant="contained"
              sx={{
                marginTop: "12px",
                backgroundColor: "#eef4ff",
                color: "#1849a9",
                boxShadow: "none",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 800,

                "&:hover": {
                  backgroundColor: "#dce8ff",
                  boxShadow: "none",
                },
              }}
            >
              Ver detalle
            </Button>
          </Box>
        ))}
      </Box>

      {/* =========================
          MODAL NUEVO PARTIDO
      ========================= */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
          }}
        >
          Nuevo partido
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gap: "14px",
              paddingTop: "8px",
            }}
          >
            <TextField
              label="Rival"
              fullWidth
            />

            <TextField
              select
              label="Categoría"
              fullWidth
              defaultValue=""
            >
              <MenuItem value="">
                Seleccionar categoría
              </MenuItem>

              <MenuItem value="sub13">
                Sub 13
              </MenuItem>

              <MenuItem value="sub15">
                Sub 15
              </MenuItem>

              <MenuItem value="sub17">
                Sub 17
              </MenuItem>

              <MenuItem value="primera">
                Primera
              </MenuItem>
            </TextField>

            <TextField
              label="Fecha"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />

            <TextField
              label="Recaudación"
              type="number"
              fullWidth
            />

            <TextField
              label="Gastos"
              type="number"
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              color: "#172033",
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={() => setOpen(false)}
            sx={{
              backgroundColor: "#1849a9",
              textTransform: "none",
              fontWeight: 700,

              "&:hover": {
                backgroundColor: "#0f3d91",
              },
            }}
          >
            Guardar partido
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Partidos;

