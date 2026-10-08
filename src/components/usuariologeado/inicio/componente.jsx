import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  LinearProgress,
} from "@mui/material";

const Inicio = () => {
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
            sx={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: ".1em",
              color: "#6d778a",
              fontWeight: 800,
            }}
          >
            Club Atlético Quilmes
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mt: 0.5,
            }}
          >
            Hola, Rocío
          </Typography>

          <Typography
            sx={{
              color: "#6d778a",
              mt: 0.5,
            }}
          >
            Así viene la administración del club.
          </Typography>
        </Box>

        {/* FILTROS */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <FormControl size="small">
            <Select
              defaultValue="Octubre"
              sx={{
                backgroundColor: "#fff",
                borderRadius: "11px",
                minWidth: 130,
              }}
            >
              <MenuItem value="Octubre">Octubre</MenuItem>
              <MenuItem value="Septiembre">Septiembre</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              defaultValue="2026"
              sx={{
                backgroundColor: "#fff",
                borderRadius: "11px",
                minWidth: 100,
              }}
            >
              <MenuItem value="2026">2026</MenuItem>
              <MenuItem value="2025">2025</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* METRICAS */}
      <Grid container spacing={1.75}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={labelStyle}>
                Jugadores activos
              </Typography>

              <Typography sx={valueStyle}>
                186
              </Typography>

              <Typography sx={labelStyle}>
                Todas las categorías
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={labelStyle}>
                Cuotas deportivas
              </Typography>

              <Typography sx={valueStyle}>
                124 / 173
              </Typography>

              <Typography sx={labelStyle}>
                71,7% cobradas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={labelStyle}>
                Cobrado este mes
              </Typography>

              <Typography sx={valueStyle}>
                $3,25 M
              </Typography>

              <Typography sx={labelStyle}>
                Ingresos registrados
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={labelStyle}>
                Pendiente de cobro
              </Typography>

              <Typography sx={valueStyle}>
                $1,35 M
              </Typography>

              <Typography sx={labelStyle}>
                Sobre $4,60 M previstos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* LO MAS IMPORTANTE */}
      <Typography sx={sectionTitle}>
        Lo más importante
      </Typography>

      <Grid container spacing={1.25}>
        <Grid item xs={12} md={6}>
          <AlertCard
            title="49 jugadores"
            text="todavía tienen pendiente octubre."
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AlertCard
            title="Sponsors: 5 de 10"
            text="$750.000 cobrados de $1.500.000."
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AlertCard
            title="$185.000 en indumentaria"
            text="todavía pendientes de cobro."
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AlertCard
            title="Sub 13: 92%"
            text="categoría con mejor cumplimiento."
          />
        </Grid>
      </Grid>

      {/* RESUMEN ECONOMICO */}
      <Typography sx={sectionTitle}>
        Resumen económico
      </Typography>

      <Grid container spacing={1.75}>
        {/* COBROS */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography fontWeight={800}>
                  Qué tenemos que cobrar
                </Typography>

                <Typography fontWeight={800}>
                  $4,60 M
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={71}
                sx={{
                  height: 9,
                  borderRadius: 20,
                  backgroundColor: "#edf0f5",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#1849a9",
                    borderRadius: 20,
                  },
                }}
              />

              <Typography sx={{ ...labelStyle, mt: 1 }}>
                71% cobrado · $3,25 M ingresados
              </Typography>

              <EconomicRow
                title="Cuotas deportivas"
                value="$1.860.000"
              />

              <EconomicRow
                title="Sponsors"
                value="$750.000"
              />

              <EconomicRow
                title="Indumentaria"
                value="$455.000"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* CAJA */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontWeight={800}>
                  Caja del mes
                </Typography>

                <Typography
                  fontWeight={900}
                  sx={{ color: "#178a52" }}
                >
                  +$1,38 M
                </Typography>
              </Box>

              <Grid
                container
                spacing={2}
                sx={{ mt: 1 }}
              >
                <Grid item xs={6}>
                  <Typography sx={labelStyle}>
                    Ingresos
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 23,
                      fontWeight: 800,
                    }}
                  >
                    $3,25 M
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={labelStyle}>
                    Egresos
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 23,
                      fontWeight: 800,
                    }}
                  >
                    $1,87 M
                  </Typography>
                </Grid>
              </Grid>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#6d778a",
                  mt: 2,
                }}
              >
                Los cobros y gastos registrados alimentan
                la caja automáticamente.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};


/* =========================
   COMPONENTES AUXILIARES
========================= */

const AlertCard = ({ title, text }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        border: "1px solid #e3e8f1",
        borderLeft: "4px solid #1849a9",
        borderRadius: "13px",
        padding: 1.75,
      }}
    >
      <Typography fontWeight={800}>
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: 13,
          color: "#6d778a",
          mt: 0.3,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};


const EconomicRow = ({ title, value }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid #e3e8f1",
      }}
    >
      <Typography>
        {title}
      </Typography>

      <Typography fontWeight={800}>
        {value}
      </Typography>
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

const valueStyle = {
  fontSize: 27,
  fontWeight: 900,
  margin: "4px 0",
};

const sectionTitle = {
  fontSize: 18,
  fontWeight: 900,
  mt: 3.2,
  mb: 1.5,
};

export default Inicio;