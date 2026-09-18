import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Button,
  InputAdornment,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaidIcon from "@mui/icons-material/Paid";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import servicio from "../../../services/socios";


const COLOR_NAVY = "#083b5c";
const COLOR_TEAL = "#148D8D";
const COLOR_SKY = "#2aaad1";
const COLOR_AMBER = "#d97706";
const COLOR_GREEN = "#15803d";

const PIE_COLORS = [
  COLOR_NAVY,
  COLOR_TEAL,
  COLOR_SKY,
  COLOR_AMBER,
  COLOR_GREEN,
  "#7c3aed",
  "#dc2626",
  "#0891b2",
];

const MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];


// -----------------------------------------
// FORMATO DE NUMEROS
// -----------------------------------------

const formatoNumero = (valor) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(Number(valor || 0));
};


const formatoCompacto = (valor) => {
  return new Intl.NumberFormat("es-AR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(valor || 0));
};


// -----------------------------------------
// FECHA YYYY-MM-DD
// -----------------------------------------

const parseFecha = (fecha) => {
  if (!fecha) return null;

  const partes = String(fecha).split("-");

  if (partes.length !== 3) return null;

  const anio = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);

  if (!anio || !mes || !dia) return null;

  return {
    anio,
    mes,
    dia,
  };
};


// -----------------------------------------
// KPI
// -----------------------------------------

function KpiCard({ icon, label, value, color, sub }) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        boxShadow: "0 6px 18px rgba(8,59,92,0.07)",
        border: "1px solid rgba(8,59,92,0.06)",
      }}
    >
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: `${color}1a`,
          color,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          fontSize={12}
          fontWeight={700}
          color="text.secondary"
          sx={{
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          {label}
        </Typography>

        <Typography
          fontSize={19}
          fontWeight={800}
          color={COLOR_NAVY}
          noWrap
        >
          {value}
        </Typography>

        {sub && (
          <Typography fontSize={11.5} color="text.secondary">
            {sub}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}


// -----------------------------------------
// CARD GRAFICO
// -----------------------------------------

function ChartCard({ title, height = 300, children, empty }) {
  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 3,
        boxShadow: "0 6px 18px rgba(8,59,92,0.07)",
        border: "1px solid rgba(8,59,92,0.06)",
        height: "100%",
      }}
    >
      <Typography
        fontWeight={800}
        fontSize={15}
        color={COLOR_NAVY}
        sx={{ mb: 1.5 }}
      >
        {title}
      </Typography>

      {empty ? (
        <Box
          sx={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            fontSize: 13,
          }}
        >
          Sin datos para mostrar
        </Box>
      ) : (
        <Box sx={{ height, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}


// =========================================
// DASHBOARD
// =========================================

export default function DashboardGastos() {

  const [gastos, setGastos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [anio, setAnio] = useState("");
  const [mes, setMes] = useState("");
  const [tipo, setTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");


  // ---------------------------------------
  // TRAER GASTOS
  // ---------------------------------------

  const traerGastos = useCallback(async () => {

    try {

      setLoading(true);
      setError(null);

      const res = await servicio.traerGastos();

      const data = res.data || res || [];

      setGastos(data);

    } catch (err) {

      console.error("Error al traer gastos:", err);

      setError("No se pudieron cargar los gastos.");

    } finally {

      setLoading(false);

    }

  }, []);


  useEffect(() => {
    traerGastos();
  }, [traerGastos]);


  // ---------------------------------------
  // DATOS CON FECHA
  // ---------------------------------------

  const gastosConFecha = useMemo(() => {

    return gastos.map((g) => ({
      ...g,
      __fecha: parseFecha(g.fecha),
    }));

  }, [gastos]);


  // ---------------------------------------
  // AÑOS
  // ---------------------------------------

  const aniosDisponibles = useMemo(() => {

    return [
      ...new Set(
        gastosConFecha
          .map((g) => g.__fecha?.anio)
          .filter(Boolean)
      ),
    ].sort((a, b) => b - a);

  }, [gastosConFecha]);


  // ---------------------------------------
  // TIPOS
  // ---------------------------------------

  const tiposDisponibles = useMemo(() => {

    return [
      ...new Set(
        gastos
          .map((g) => g.tipo)
          .filter(Boolean)
      ),
    ].sort();

  }, [gastos]);


  // ---------------------------------------
  // FILTROS
  // ---------------------------------------

  const filtrados = useMemo(() => {

    const texto = busqueda.toLowerCase().trim();

    return gastosConFecha.filter((g) => {

      if (
        anio &&
        g.__fecha?.anio !== Number(anio)
      ) {
        return false;
      }

      if (
        mes &&
        g.__fecha?.mes !== Number(mes)
      ) {
        return false;
      }

      if (
        tipo &&
        g.tipo !== tipo
      ) {
        return false;
      }

      if (
        texto &&
        !String(g.nombre || "")
          .toLowerCase()
          .includes(texto)
      ) {
        return false;
      }

      return true;

    });

  }, [
    gastosConFecha,
    anio,
    mes,
    tipo,
    busqueda,
  ]);


  // ---------------------------------------
  // KPIs
  // ---------------------------------------

  const kpis = useMemo(() => {

    const total = filtrados.reduce(
      (acc, g) =>
        acc + Number(g.monto || 0),
      0
    );

    const cantidad = filtrados.length;

    const promedio =
      cantidad > 0
        ? total / cantidad
        : 0;

    return {
      total,
      cantidad,
      promedio,
    };

  }, [filtrados]);


  // ---------------------------------------
  // GASTOS POR MES
  // ---------------------------------------

  const gastosPorMes = useMemo(() => {

    const grupos = new Map();

    filtrados.forEach((g) => {

      if (!g.__fecha) return;

      const key =
        `${g.__fecha.anio}-${String(
          g.__fecha.mes
        ).padStart(2, "0")}`;

      if (!grupos.has(key)) {

        grupos.set(key, {
          key,
          label: `${MESES[g.__fecha.mes - 1]} ${String(
            g.__fecha.anio
          ).slice(-2)}`,
          total: 0,
        });

      }

      grupos.get(key).total +=
        Number(g.monto || 0);

    });

    return [...grupos.values()]
      .sort((a, b) =>
        a.key.localeCompare(b.key)
      );

  }, [filtrados]);


  // ---------------------------------------
  // GASTOS POR TIPO
  // ---------------------------------------

  const gastosPorTipo = useMemo(() => {

    const grupos = new Map();

    filtrados.forEach((g) => {

      const nombreTipo =
        g.tipo || "Sin tipo";

      grupos.set(
        nombreTipo,
        (grupos.get(nombreTipo) || 0) +
          Number(g.monto || 0)
      );

    });

    return [...grupos.entries()]
      .map(([name, total]) => ({
        name,
        total,
      }))
      .sort((a, b) => b.total - a.total);

  }, [filtrados]);


  // ---------------------------------------
  // PIE
  // ---------------------------------------

  const distribucionTipo = useMemo(() => {

    return gastosPorTipo.map((g) => ({
      name: g.name,
      value: g.total,
    }));

  }, [gastosPorTipo]);


  // ---------------------------------------
  // GASTO DEL MES
  // ---------------------------------------

  const gastoMes = useMemo(() => {

    const ahora = new Date();

    const anioActual = ahora.getFullYear();
    const mesActual = ahora.getMonth() + 1;

    return gastosConFecha
      .filter(
        (g) =>
          g.__fecha?.anio === anioActual &&
          g.__fecha?.mes === mesActual
      )
      .reduce(
        (acc, g) =>
          acc + Number(g.monto || 0),
        0
      );

  }, [gastosConFecha]);


  // ---------------------------------------
  // LIMPIAR
  // ---------------------------------------

  const limpiarFiltros = () => {

    setAnio("");
    setMes("");
    setTipo("");
    setBusqueda("");

  };


  // ---------------------------------------
  // RENDER
  // ---------------------------------------

  return (
    <Box sx={{ mt: 1 }}>

      {/* ===============================
          TITULO
      =============================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2.5,
          gap: 2,
          flexWrap: "wrap",
        }}
      >

        <Box>

          <Typography
            fontWeight={800}
            fontSize={21}
            color={COLOR_NAVY}
          >
            Dashboard de gastos
          </Typography>

          <Typography
            color="text.secondary"
            fontSize={13}
          >
            Resumen de gastos por fecha y tipo
          </Typography>

        </Box>

        <Button
          onClick={traerGastos}
          disabled={loading}
          startIcon={<RefreshIcon />}
          sx={{
            color: COLOR_NAVY,
            fontWeight: 700,
            borderRadius: 2.5,
          }}
        >
          Actualizar
        </Button>

      </Box>


      {/* ===============================
          ERROR
      =============================== */}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}


      {/* ===============================
          LOADING
      =============================== */}

      {loading ? (

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 10,
          }}
        >
          <CircularProgress />
        </Box>

      ) : (

        <>


          {/* ===========================
              FILTROS
          =========================== */}

          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              mb: 2.5,
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              alignItems: "center",
              boxShadow:
                "0 6px 18px rgba(8,59,92,0.07)",
            }}
          >

            <TextField
              select
              size="small"
              label="Año"
              value={anio}
              onChange={(e) =>
                setAnio(e.target.value)
              }
              sx={{
                width: {
                  xs: "100%",
                  sm: 130,
                },
              }}
            >

              <MenuItem value="">
                Todos
              </MenuItem>

              {aniosDisponibles.map((a) => (
                <MenuItem
                  key={a}
                  value={a}
                >
                  {a}
                </MenuItem>
              ))}

            </TextField>


            <TextField
              select
              size="small"
              label="Mes"
              value={mes}
              onChange={(e) =>
                setMes(e.target.value)
              }
              sx={{
                width: {
                  xs: "100%",
                  sm: 140,
                },
              }}
            >

              <MenuItem value="">
                Todos
              </MenuItem>

              {MESES.map((nombre, index) => (

                <MenuItem
                  key={index}
                  value={index + 1}
                >
                  {nombre}
                </MenuItem>

              ))}

            </TextField>


            <TextField
              select
              size="small"
              label="Tipo"
              value={tipo}
              onChange={(e) =>
                setTipo(e.target.value)
              }
              sx={{
                width: {
                  xs: "100%",
                  sm: 180,
                },
              }}
            >

              <MenuItem value="">
                Todos
              </MenuItem>

              {tiposDisponibles.map((t) => (

                <MenuItem
                  key={t}
                  value={t}
                >
                  {t}
                </MenuItem>

              ))}

            </TextField>


            <TextField
              size="small"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              sx={{
                flexGrow: 1,
                minWidth: 220,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    🔎
                  </InputAdornment>
                ),
              }}
            />


            {(anio ||
              mes ||
              tipo ||
              busqueda) && (

              <Button
                onClick={limpiarFiltros}
                size="small"
              >
                Limpiar
              </Button>

            )}

          </Paper>


          {/* ===========================
              KPIs
          =========================== */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(4, 1fr)",
              },
              gap: 1.75,
              mb: 2.5,
            }}
          >

            <KpiCard
              icon={<PaidIcon />}
              color={COLOR_GREEN}
              label="Total gastos"
              value={formatoCompacto(kpis.total)}
              sub={formatoNumero(kpis.total)}
            />

            <KpiCard
              icon={<ReceiptLongIcon />}
              color={COLOR_NAVY}
              label="Cantidad"
              value={kpis.cantidad}
              sub="gastos registrados"
            />

            <KpiCard
              icon={<CalendarMonthIcon />}
              color={COLOR_SKY}
              label="Este mes"
              value={formatoCompacto(gastoMes)}
              sub={formatoNumero(gastoMes)}
            />

            <KpiCard
              icon={<TrendingUpIcon />}
              color={COLOR_AMBER}
              label="Promedio"
              value={formatoCompacto(kpis.promedio)}
              sub={formatoNumero(kpis.promedio)}
            />

          </Box>


          {/* ===========================
              GRAFICOS PRINCIPALES
          =========================== */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "2fr 1fr",
              },
              gap: 2.5,
              mb: 2.5,
            }}
          >

            {/* LINEA */}

            <ChartCard
              title="Gastos en el tiempo"
              height={320}
              empty={gastosPorMes.length === 0}
            >

              <LineChart
                data={gastosPorMes}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eef2f5"
                />

                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tickFormatter={formatoCompacto}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip
                  formatter={(value) =>
                    formatoNumero(value)
                  }
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  name="Gastos"
                  stroke={COLOR_NAVY}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />

              </LineChart>

            </ChartCard>


            {/* BARRAS */}

            <ChartCard
              title="Gastos por tipo"
              height={320}
              empty={gastosPorTipo.length === 0}
            >

              <BarChart
                data={gastosPorTipo}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 15,
                  left: 20,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#eef2f5"
                />

                <XAxis
                  type="number"
                  tickFormatter={formatoCompacto}
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={100}
                />

                <Tooltip
                  formatter={(value) =>
                    formatoNumero(value)
                  }
                />

                <Bar
                  dataKey="total"
                  name="Gastos"
                  fill={COLOR_AMBER}
                  radius={[
                    0,
                    5,
                    5,
                    0,
                  ]}
                />

              </BarChart>

            </ChartCard>

          </Box>


          {/* ===========================
              PIE
          =========================== */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr",
              },
            }}
          >

            <ChartCard
              title="Distribución de gastos por tipo"
              height={280}
              empty={
                distribucionTipo.length === 0
              }
            >

              <PieChart>

                <Pie
                  data={distribucionTipo}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${(
                      percent * 100
                    ).toFixed(0)}%`
                  }
                >

                  {distribucionTipo.map(
                    (entry, index) => (

                      <Cell
                        key={entry.name}
                        fill={
                          PIE_COLORS[
                            index %
                              PIE_COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip
                  formatter={(value) =>
                    formatoNumero(value)
                  }
                />

                <Legend />

              </PieChart>

            </ChartCard>

          </Box>

        </>

      )}

    </Box>
  );
}