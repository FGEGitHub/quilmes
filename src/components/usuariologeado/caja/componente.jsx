
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import servicioCaja from "../../../services/socios";

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);

const Caja = () => {
  const [resumen, setResumen] = useState({
    ingresos: 0,
    egresos: 0,
    resultado: 0,
    gastos_fijos_pendientes: 0,
  });

  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const [respuestaResumen, respuestaMovimientos] =
        await Promise.all([
          servicioCaja.quilmesResumenCaja(),
          servicioCaja.quilmesListarMovimientosCaja(),
        ]);

      setResumen({
        ingresos: Number(respuestaResumen?.ingresos ?? 0),
        egresos: Number(respuestaResumen?.egresos ?? 0),
        resultado: Number(respuestaResumen?.resultado ?? 0),
        gastos_fijos_pendientes: Number(
          respuestaResumen?.gastos_fijos_pendientes ?? 0
        ),
      });

      setMovimientos(
        Array.isArray(respuestaMovimientos)
          ? respuestaMovimientos
          : []
      );
    } catch (err) {
      console.error("Error cargando caja:", err);
      setError(
        err.response?.data?.mensaje ||
          "No se pudieron cargar los datos de caja."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const metricas = [
    {
      label: "Ingresos",
      value: formatoMoneda(resumen.ingresos),
    },
    {
      label: "Egresos",
      value: formatoMoneda(resumen.egresos),
    },
    {
      label: "Resultado",
      value: `${resumen.resultado >= 0 ? "+" : "−"}${formatoMoneda(
        Math.abs(resumen.resultado)
      )}`,
      positivo: resumen.resultado >= 0,
    },
    {
      label: "Gastos fijos pendientes",
      value: formatoMoneda(resumen.gastos_fijos_pendientes),
    },
  ];

  const esIngreso = (tipo) =>
    String(tipo || "").toLowerCase() === "cobro";

  return (
    <Box
      sx={{
        padding: "28px",
        maxWidth: "1280px",
        width: "100%",
        margin: "auto",
        boxSizing: "border-box",
        "@media (max-width: 850px)": {
          padding: "18px",
        },
      }}
    >
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

          <Typography sx={{ color: "#6d778a", marginTop: "5px" }}>
            Ingresos y egresos del club en un único lugar.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={cargarDatos}
          disabled={cargando}
          sx={{
            backgroundColor: "#1849a9",
            borderRadius: "10px",
            padding: "9px 12px",
            fontWeight: 800,
            textTransform: "none",
            "&:hover": { backgroundColor: "#0f3d91" },
          }}
        >
          {cargando ? "Actualizando..." : "Actualizar caja"}
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={cargarDatos}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "14px",
          "@media (max-width: 850px)": {
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
              minWidth: 0,
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#6d778a" }}>
              {item.label}
            </Typography>

            <Typography
              sx={{
                fontSize: 27,
                fontWeight: 900,
                margin: "4px 0",
                color:
                  item.positivo === undefined
                    ? "#172033"
                    : item.positivo
                    ? "#178a52"
                    : "#c43c45",
                overflowWrap: "anywhere",
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

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
        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : movimientos.length === 0 ? (
          <Typography sx={{ color: "#6d778a", py: 2 }}>
            No hay movimientos registrados.
          </Typography>
        ) : (
          movimientos.map((movimiento, index) => {
            const ingreso = esIngreso(movimiento.tipo);
            const nombre =
              movimiento.actividad ||
              movimiento.concepto ||
              "Movimiento sin descripción";

            return (
              <Box
                key={movimiento.id ?? index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  padding: "12px 0",
                  borderBottom:
                    index !== movimientos.length - 1
                      ? "1px solid #e3e8f1"
                      : "none",
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {nombre}
                  </Typography>

                  <Typography sx={{ fontSize: 12, color: "#6d778a" }}>
                    {movimiento.fecha
                      ? new Date(movimiento.fecha).toLocaleDateString(
                          "es-AR",
                          { timeZone: "UTC" }
                        )
                      : "Sin fecha"}
                    {" · "}
                    {ingreso ? "Cobro" : "Gasto"}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                    color: ingreso ? "#178a52" : "#c43c45",
                  }}
                >
                  {ingreso ? "+" : "−"}
                  {formatoMoneda(movimiento.monto)}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default Caja;
