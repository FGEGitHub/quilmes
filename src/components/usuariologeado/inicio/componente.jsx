
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  Groups,
  SportsSoccer,
  Payments,
  Handshake,
  TrendingUp,
  AccountBalanceWallet,
} from "@mui/icons-material";

import { traerdatosinicio } from "../../../services/socios";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);

const formatoNumero = (valor) =>
  new Intl.NumberFormat("es-AR").format(Number(valor) || 0);

const cardStyle = {
  height: "100%",
  borderRadius: 3,
  border: "1px solid #e8edf3",
  boxShadow: "0 3px 14px rgba(15, 23, 42, 0.045)",
  backgroundColor: "#fff",
};

const labelStyle = {
  color: "#64748b",
  fontSize: "0.85rem",
  fontWeight: 500,
};

const valueStyle = {
  color: "#172033",
  fontSize: { xs: "1.65rem", md: "1.9rem" },
  fontWeight: 750,
  mt: 1,
  lineHeight: 1.25,
};

const sectionTitle = {
  fontSize: "1.05rem",
  fontWeight: 750,
  color: "#172033",
  mb: 2,
};

function MetricCard({ icon, title, value, subtitle, color = "#2563eb" }) {
  return (
    <Card sx={cardStyle}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <Typography sx={labelStyle}>{title}</Typography>

          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: `${color}14`,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography sx={valueStyle}>{value}</Typography>

        {subtitle && (
          <Typography
            sx={{ color: "#64748b", fontSize: "0.8rem", mt: 1 }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function EconomicRow({ label, value, color = "#172033" }) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      py={1.5}
      sx={{ borderBottom: "1px solid #edf0f4" }}
    >
      <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
        {label}
      </Typography>

      <Typography
        sx={{
          fontWeight: 700,
          color,
          textAlign: "right",
          fontSize: "0.95rem",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function Inicio() {
  const fechaActual = new Date();

  const [mes, setMes] = useState(fechaActual.getMonth() + 1);
  const [anio, setAnio] = useState(fechaActual.getFullYear());

  const [datos, setDatos] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Recuperar el usuario de la sesión.
  const obtenerUsuario = () => {
    try {
      const usuarioGuardado = localStorage.getItem("loggedNoteAppUser");

      if (!usuarioGuardado) return null;

      const usuario = JSON.parse(usuarioGuardado);

      setNombreUsuario(
        usuario?.nombre ||
          usuario?.name ||
          usuario?.usuario ||
          usuario?.username ||
          ""
      );

      return usuario?.id || usuario?.id_usuario || usuario?.userId || null;
    } catch (e) {
      console.error("No se pudo leer el usuario guardado:", e);
      return null;
    }
  };

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      setCargando(true);
      setError("");

      try {
        const idUsuario = obtenerUsuario();

        if (!idUsuario) {
          throw new Error(
            "No se encontró el ID del usuario. Cerrá sesión e ingresá nuevamente."
          );
        }

        // Endpoint existente: GET /traerdatosinicio?id=...&mes=...&anio=...
        const respuesta = await traerdatosinicio({
          id: idUsuario,
          mes,
          anio,
        });

        // Permite trabajar tanto con Axios como con un servicio que
        // ya devuelve directamente el objeto de respuesta.
        const resultado = respuesta?.data ?? respuesta;

        if (!activo) return;

        setDatos(resultado);

        if (resultado?.nombreUsuario) {
          setNombreUsuario(resultado.nombreUsuario);
        }
      } catch (e) {
        console.error("Error cargando inicio:", e);

        if (activo) {
          setDatos(null);
          setError(
            e?.response?.data?.error ||
              e?.message ||
              "No se pudieron cargar los datos del inicio."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarDatos();

    return () => {
      activo = false;
    };
  }, [mes, anio]);

  const jugadoresActivos = Number(datos?.jugadoresActivos ?? 0);
  const cuotasCobradas = Number(datos?.cuotasCobradas ?? 0);
  const cobradoCuotas = Number(datos?.cobradoCuotas ?? 0);
  const cobradoSponsors = Number(datos?.cobradoSponsors ?? 0);

  const totalCobradoDisponible = cobradoCuotas + cobradoSponsors;

  const porcentajeCuotas =
    jugadoresActivos > 0
      ? Math.min(100, (cuotasCobradas / jugadoresActivos) * 100)
      : 0;

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 }, bgcolor: "#f7f9fc", minHeight: "100%" }}>
      {/* Encabezado */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        gap={2}
        mb={3}
      >
        <Box>
          <Typography
            sx={{
              color: "#172033",
              fontSize: { xs: "1.45rem", md: "1.85rem" },
              fontWeight: 800,
            }}
          >
            Club Atlético Quilmes
          </Typography>

          <Typography sx={{ color: "#64748b", mt: 0.5 }}>
            Hola{nombreUsuario ? `, ${nombreUsuario}` : ""}. Este es el resumen
            de actividad del club.
          </Typography>
        </Box>

        <Box display="flex" gap={1.5}>
          <FormControl size="small" sx={{ minWidth: 135, bgcolor: "#fff" }}>
            <Select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              aria-label="Seleccionar mes"
            >
              {MESES.map((nombre, index) => (
                <MenuItem key={nombre} value={index + 1}>
                  {nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 105, bgcolor: "#fff" }}>
            <Select
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              aria-label="Seleccionar año"
            >
              {Array.from(
                { length: 7 },
                (_, index) => fechaActual.getFullYear() - 3 + index
              ).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {cargando && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography
            sx={{ mt: 1, fontSize: "0.85rem", color: "#64748b" }}
          >
            Cargando datos del club...
          </Typography>
        </Box>
      )}

      {!cargando && datos && (
        <>
          {/* Indicadores principales */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                icon={<Groups />}
                title="Jugadores activos"
                value={formatoNumero(jugadoresActivos)}
                subtitle="Socios con estado deportivo activo"
                color="#2563eb"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                icon={<SportsSoccer />}
                title="Cuotas registradas"
                value={formatoNumero(cuotasCobradas)}
                subtitle={`${MESES[mes - 1]} de ${anio}`}
                color="#7c3aed"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                icon={<Payments />}
                title="Cobrado en cuotas"
                value={formatoMoneda(cobradoCuotas)}
                subtitle="Total del período seleccionado"
                color="#059669"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                icon={<Handshake />}
                title="Cobrado de sponsors"
                value={formatoMoneda(cobradoSponsors)}
                subtitle="Movimientos registrados en el período"
                color="#d97706"
              />
            </Grid>
          </Grid>

          {/* Resumen económico */}
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Card sx={cardStyle}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography sx={sectionTitle}>
                    Resumen del período
                  </Typography>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#f0fdf4",
                      mb: 2,
                    }}
                  >
                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                      Total cobrado disponible
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: { xs: "1.7rem", md: "2rem" },
                        fontWeight: 800,
                        color: "#15803d",
                        mt: 0.5,
                      }}
                    >
                      {formatoMoneda(totalCobradoDisponible)}
                    </Typography>

                    <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                      Suma de cuotas y sponsors devuelta por el backend.
                    </Typography>
                  </Box>

                  <EconomicRow
                    label="Cuotas deportivas"
                    value={formatoMoneda(cobradoCuotas)}
                  />

                  <EconomicRow
                    label="Ingresos de sponsors"
                    value={formatoMoneda(cobradoSponsors)}
                  />

                  <EconomicRow
                    label="Cuotas registradas"
                    value={formatoNumero(cuotasCobradas)}
                  />

                  <Box mt={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      gap={1}
                      mb={1}
                    >
                      <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
                        Cuotas registradas frente a jugadores activos
                      </Typography>

                      <Typography sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                        {porcentajeCuotas.toLocaleString("es-AR", {
                          maximumFractionDigits: 1,
                        })}
                        %
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={porcentajeCuotas}
                      sx={{
                        height: 9,
                        borderRadius: 10,
                        bgcolor: "#e2e8f0",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 10,
                          bgcolor: "#16a34a",
                        },
                      }}
                    />

                    <Typography
                      sx={{ color: "#64748b", fontSize: "0.75rem", mt: 1 }}
                    >
                      Este indicador compara cantidades; no representa el
                      porcentaje de dinero cobrado ni confirma cuántos
                      jugadores deben una cuota.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Información disponible */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={cardStyle}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography sx={sectionTitle}>
                    Estado del club
                  </Typography>

                  <Box
                    display="flex"
                    alignItems="flex-start"
                    gap={1.5}
                    mb={2.5}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        borderRadius: 2,
                        bgcolor: "#eff6ff",
                        color: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Groups />
                    </Box>

                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        Plantel activo
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.85rem", color: "#64748b", mt: 0.5 }}
                      >
                        El sistema informa {formatoNumero(jugadoresActivos)}{" "}
                        jugadores activos.
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    alignItems="flex-start"
                    gap={1.5}
                    mb={2.5}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        borderRadius: 2,
                        bgcolor: "#f5f3ff",
                        color: "#7c3aed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Payments />
                    </Box>

                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        Cuotas del período
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.85rem", color: "#64748b", mt: 0.5 }}
                      >
                        Hay {formatoNumero(cuotasCobradas)} cuotas registradas
                        para {MESES[mes - 1].toLowerCase()} de {anio}.
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    alignItems="flex-start"
                    gap={1.5}
                    mb={2.5}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        borderRadius: 2,
                        bgcolor: "#fffbeb",
                        color: "#d97706",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Handshake />
                    </Box>

                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        Sponsors
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.85rem", color: "#64748b", mt: 0.5 }}
                      >
                        Ingresos registrados: {formatoMoneda(cobradoSponsors)}.
                      </Typography>
                    </Box>
                  </Box>

                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Los importes pendientes, la cantidad de sponsors que
                    pagaron y el cumplimiento por categoría todavía no están
                    incluidos en la respuesta actual del backend.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Caja: no se muestra un total inventado ni se etiqueta
              como mensual porque el endpoint actual devuelve totales generales. */}
          <Card sx={{ ...cardStyle, mt: 2.5 }}>
            <CardContent
              sx={{
                p: { xs: 2, md: 3 },
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: 2,
                  bgcolor: "#ecfdf5",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AccountBalanceWallet />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 750, color: "#172033" }}>
                  Caja del club
                </Typography>

                <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mt: 0.5 }}>
                  El endpoint de resumen de caja ya existe, pero devuelve
                  totales generales sin filtrar por mes y año. Para mostrar
                  ingresos, egresos y saldo del período seleccionado debemos
                  ajustar el backend antes de conectarlo a este resumen.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
