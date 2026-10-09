import React, { useEffect, useState } from "react";
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
  Alert,
} from "@mui/material";
import { traerdatosinicio } from "../../../services/socios";

const meses = [
  { valor: 1, nombre: "Enero" },
  { valor: 2, nombre: "Febrero" },
  { valor: 3, nombre: "Marzo" },
  { valor: 4, nombre: "Abril" },
  { valor: 5, nombre: "Mayo" },
  { valor: 6, nombre: "Junio" },
  { valor: 7, nombre: "Julio" },
  { valor: 8, nombre: "Agosto" },
  { valor: 9, nombre: "Septiembre" },
  { valor: 10, nombre: "Octubre" },
  { valor: 11, nombre: "Noviembre" },
  { valor: 12, nombre: "Diciembre" },
];

const formatoNumero = (valor) =>
  new Intl.NumberFormat("es-AR").format(Number(valor) || 0);

const formatoPesos = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(Number(valor) || 0);

const Inicio = () => {
  const hoy = new Date();

  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());

  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Recuperar el usuario que inició sesión.
  const loggedUserJSON = window.localStorage.getItem(
    "loggedNoteAppUser"
  );

  let userContext = null;

  if (loggedUserJSON) {
    try {

      userContext = JSON.parse(loggedUserJSON);
    } catch (err) {
      console.error("Error al leer el usuario:", err);
    }
  }

  const idUsuario = userContext?.id;

  const nombreUsuario = datos?.nombreUsuario || "Usuario";

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
    
      if (!idUsuario) {
        setDatos(null);
        setError("No se encontró el ID del usuario en la sesión.");
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError("");

        const respuesta = await traerdatosinicio({
          id: idUsuario,
          mes,
          anio,
        });
  
        if (activo) {
          setDatos(respuesta);
        }
      } catch (err) {
        console.error("Error al cargar el inicio:", err);

        if (activo) {
          setError(
            err.response?.data?.error ||
              "No se pudieron cargar los datos del club."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarDatos();

    return () => {
      activo = false;
    };
  }, [idUsuario, mes, anio]);

  const porcentajeCuotas =
    datos?.cuotasCobradas > 0 ? 100 : 0;

  return (
    <Box
      sx={{
        backgroundColor: "#f6f8fc",
        minHeight: "100vh",
        p: { xs: 2, md: 3.5 },
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

          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
            Hola, {nombreUsuario}
          </Typography>

          <Typography sx={{ color: "#6d778a", mt: 0.5 }}>
            Así viene la administración del club.
          </Typography>
        </Box>

        {/* FILTROS */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <FormControl size="small">
            <Select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "11px",
                minWidth: 140,
              }}
            >
              {meses.map((item) => (
                <MenuItem key={item.valor} value={item.valor}>
                  {item.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "11px",
                minWidth: 100,
              }}
            >
              {[hoy.getFullYear(), hoy.getFullYear() - 1,
                hoy.getFullYear() - 2].map((valor) => (
                <MenuItem key={valor} value={valor}>
                  {valor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {cargando && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography sx={{ mt: 1, color: "#6d778a", fontSize: 13 }}>
            Actualizando datos...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* MÉTRICAS PRINCIPALES */}
      <Grid container spacing={1.75}>
       <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={labelStyle}>
                Jugadores activos
              </Typography>
              <Typography sx={valueStyle}>
                {formatoNumero(datos?.jugadoresActivos)}
              </Typography>
              <Typography sx={labelStyle}>
                Todas las categorías
              </Typography>
            </CardContent>
          </Card>
        </Grid>

   <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={labelStyle}>
                Cuotas registradas
              </Typography>
              <Typography sx={valueStyle}>
                {formatoNumero(datos?.cuotasCobradas)}
              </Typography>
              <Typography sx={labelStyle}>
                Cuotas del período seleccionado
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={labelStyle}>
                Cobrado en cuotas
              </Typography>
              <Typography sx={{ ...valueStyle, fontSize: 23 }}>
                {formatoPesos(datos?.cobradoCuotas)}
              </Typography>
              <Typography sx={labelStyle}>
                {meses[mes - 1].nombre} de {anio}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

       <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography sx={labelStyle}>
                Cobrado de sponsors
              </Typography>
              <Typography sx={{ ...valueStyle, fontSize: 23 }}>
                {formatoPesos(datos?.cobradoSponsors)}
              </Typography>
              <Typography sx={labelStyle}>
                {meses[mes - 1].nombre} de {anio}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* INFORMACIÓN DISPONIBLE */}
      <Typography sx={sectionTitle}>
        Resumen del período
      </Typography>

      <Grid container spacing={1.75}>
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography fontWeight={800} sx={{ mb: 1 }}>
                Cuotas deportivas
              </Typography>

              <Typography sx={{ fontSize: 28, fontWeight: 900 }}>
                {formatoPesos(datos?.cobradoCuotas)}
              </Typography>

              <Typography sx={labelStyle}>
                Total registrado en cuotas para {meses[mes - 1].nombre} de {anio}.
              </Typography>

              <EconomicRow
                title="Cantidad de cuotas"
                value={formatoNumero(datos?.cuotasCobradas)}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography fontWeight={800} sx={{ mb: 1 }}>
                Ingresos de sponsors
              </Typography>

              <Typography
                sx={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#178a52",
                }}
              >
                {formatoPesos(datos?.cobradoSponsors)}
              </Typography>

              <Typography sx={labelStyle}>
                Movimientos con tipo "Cobro de sponsor" en el período.
              </Typography>

    <EconomicRow
  title="Mes consultado"
  value={`${meses[mes - 1].nombre} ${anio}`}
/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {!cargando && !error && datos && (
        <Typography
          sx={{
            mt: 3,
            color: "#6d778a",
            fontSize: 12,
          }}
        >
          Datos actualizados para {meses[mes - 1].nombre} de {anio}.
        </Typography>
      )}
    </Box>
  );
};

/* ESTILOS */

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
  my: 0.5,
};

const sectionTitle = {
  fontSize: 18,
  fontWeight: 900,
  mt: 3.2,
  mb: 1.5,
};

const EconomicRow = ({ title, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 1.5,
      gap: 2,
      borderBottom: "1px solid #e3e8f1",
    }}
  >
    <Typography>{title}</Typography>
    <Typography fontWeight={800}>{value}</Typography>
  </Box>
);

export default Inicio;