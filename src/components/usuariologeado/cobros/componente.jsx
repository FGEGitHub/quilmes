import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";

const Cobros = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f6f8fc",
        minHeight: "100vh",
        padding: { xs: 2, md: 3.5 },
        color: "#172033",
      }}
    >
      {/* ENCABEZADO */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "flex-end" },
          gap: 2,
          mb: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
            }}
          >
            Cobros
          </Typography>

          <Typography
            sx={{
              color: "#6d778a",
              mt: 0.5,
            }}
          >
            Lo esperado, lo cobrado y lo que todavía falta ingresar.
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1849a9",
            borderRadius: "10px",
            fontWeight: 800,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#0f3d91",
            },
          }}
        >
          + Registrar cobro
        </Button>
      </Box>

      {/* METRICAS */}
      <Grid container spacing={1.75}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Esperado"
            value="$4,60 M"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Cobrado"
            value="$3,25 M"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Pendiente"
            value="$1,35 M"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Cumplimiento"
            value="71%"
          />
        </Grid>
      </Grid>

      {/* POR TIPO DE COBRO */}
      <Typography sx={sectionTitle}>
        Por tipo de cobro
      </Typography>

      <Grid container spacing={1.75}>
        {/* CUOTAS */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography fontWeight={800}>
                    Cuotas deportivas
                  </Typography>

                  <Typography sx={labelStyle}>
                    124 de 173
                  </Typography>
                </Box>

                <Typography fontWeight={800}>
                  $1.860.000
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={72}
                sx={progressStyle}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* SPONSORS */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography fontWeight={800}>
                    Sponsors
                  </Typography>

                  <Typography sx={labelStyle}>
                    5 de 10 cobrados
                  </Typography>
                </Box>

                <Typography fontWeight={800}>
                  $750.000 / $1.500.000
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={50}
                sx={progressStyle}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SPONSORS */}
      <Typography sx={sectionTitle}>
        Sponsors
      </Typography>

      <Card sx={cardStyle}>
        <CardContent sx={{ padding: 0 }}>
          <SponsorRow
            nombre="Supermercado Norte"
            detalle="Aporte mensual $150.000"
            estado="Pagado"
            tipo="paid"
          />

          <SponsorRow
            nombre="Empresa Centro"
            detalle="$100.000 de $200.000"
            estado="Parcial"
            tipo="partial"
          />

          <SponsorRow
            nombre="Comercio Sur"
            detalle="$150.000 pendientes"
            estado="Pendiente"
            tipo="pending"
            last
          />
        </CardContent>
      </Card>
    </Box>
  );
};


/* =========================
   COMPONENTES AUXILIARES
========================= */

const MetricCard = ({ label, value }) => {
  return (
    <Card sx={cardStyle}>
      <CardContent>
        <Typography sx={labelStyle}>
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: 27,
            fontWeight: 900,
            margin: "4px 0",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};


const SponsorRow = ({
  nombre,
  detalle,
  estado,
  tipo,
  last,
}) => {
  const colores = {
    paid: {
      background: "#e8f7ef",
      color: "#178a52",
    },
    partial: {
      background: "#fff3dc",
      color: "#b87808",
    },
    pending: {
      background: "#fdecef",
      color: "#c43c45",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        padding: "12px 18px",
        borderBottom: last
          ? "none"
          : "1px solid #e3e8f1",
      }}
    >
      <Box>
        <Typography fontWeight={800}>
          {nombre}
        </Typography>

        <Typography sx={labelStyle}>
          {detalle}
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: colores[tipo].background,
          color: colores[tipo].color,
          fontSize: 12,
          fontWeight: 800,
          borderRadius: "20px",
          padding: "5px 9px",
          whiteSpace: "nowrap",
        }}
      >
        {estado}
      </Box>
    </Box>
  );
};


/* =========================
   ESTILOS
========================= */

const cardStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e3e8f1",
  borderRadius: "17px",
  boxShadow: "none",
};

const labelStyle = {
  fontSize: 13,
  color: "#6d778a",
};

const sectionTitle = {
  fontSize: 18,
  fontWeight: 900,
  mt: 3.2,
  mb: 1.5,
};

const progressStyle = {
  height: 9,
  borderRadius: 20,
  backgroundColor: "#edf0f5",
  mt: 1.5,
  "& .MuiLinearProgress-bar": {
    backgroundColor: "#1849a9",
    borderRadius: 20,
  },
};

export default Cobros;