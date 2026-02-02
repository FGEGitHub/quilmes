import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Paper
} from "@mui/material";
import { useParams } from "react-router-dom";
import servicioSocios from "../../../services/socios";

const meses = [
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

const CuotasSocio = () => {
  const { id } = useParams();
const [openDetalle, setOpenDetalle] = useState(false);
const [detalleCuota, setDetalleCuota] = useState(null);

  const [cuotas, setCuotas] = useState([]);
  const [open, setOpen] = useState(false);

  const [formPago, setFormPago] = useState({
    mes: "",
    anio: new Date().getFullYear(),
    fecha_pago: "",
    medio: "",
  });
const verDetalle = (mes, anio) => {
  const cuota = cuotas.find(
    (c) => Number(c.mes) === mes && Number(c.anio) === Number(anio)
  );

  if (cuota) {
    setDetalleCuota(cuota);
    setOpenDetalle(true);
  }
};

const cerrarDetalle = () => {
  setOpenDetalle(false);
  setDetalleCuota(null);
};

  /* =========================
     TRAER CUOTAS
  ========================= */
  useEffect(() => {
    const traerCuotas = async () => {
      try {
        const res = await servicioSocios.traercuotas(id);
        setCuotas(res);
      } catch (error) {
        console.error(error);
        alert("Error al cargar cuotas");
      }
    };

    if (id) traerCuotas();
  }, [id]);

  /* =========================
     HELPERS
  ========================= */
  const estaPagado = (mes, anio) => {
    return cuotas.some(
      (c) => Number(c.mes) === mes && Number(c.anio) === Number(anio)
    );
  };

  const aniosDisponibles = [...new Set(cuotas.map((c) => c.anio))];

  const anioActual = new Date().getFullYear();

  /* =========================
     MANEJO DIALOG
  ========================= */
  const abrirDialog = () => setOpen(true);
  const cerrarDialog = () => setOpen(false);

  const handleChange = (e) => {
    setFormPago({
      ...formPago,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     PAGAR CUOTA
  ========================= */
  const pagarCuota = async () => {
    try {
 if (!formPago.mes || !formPago.anio) {
  alert("Debe seleccionar mes y año");
  return;
}


      await servicioSocios.pagarcuota({
        socio_id: id,
        ...formPago,
      });

      alert("Cuota registrada correctamente");
      cerrarDialog();

      // Refrescar cuotas
      const res = await servicioSocios.traercuotas(id);
      setCuotas(res);
    } catch (error) {
      console.error(error);
      alert("Error al registrar pago");
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Cuotas del Socio
      </Typography>

      {/* ================= TABLA HORIZONTAL ================= */}
     {/*  <Paper sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" mb={2}>
          Estado mensual ({anioActual})
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              {meses.map((mes, index) => (
                <TableCell key={index} align="center">
                  {mes}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              {meses.map((_, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    backgroundColor: estaPagado(index + 1, anioActual)
                      ? "#c8e6c9"
                      : "#ffcdd2",
                    fontWeight: "bold",
                  }}
                >
                  {estaPagado(index + 1, anioActual) ? "✔ Pagado" : "✖ Pendiente"}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
 */}
      {/* ================= CALENDARIO MENSUAL ================= */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" mb={2}>
          Calendario de Pagos
        </Typography>

        {aniosDisponibles.length === 0 && (
          <Typography>No hay pagos registrados</Typography>
        )}

        {aniosDisponibles.map((anio) => (
          <Box key={anio} mb={3}>
            <Typography variant="subtitle1" mb={1}>
              Año {anio}
            </Typography>

            <Grid container spacing={2}>
              {meses.map((mes, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Paper
  onClick={() => {
    if (estaPagado(index + 1, anio)) {
      verDetalle(index + 1, anio);
    }
  }}
  sx={{
    p: 1.5,
    textAlign: "center",
    backgroundColor: estaPagado(index + 1, anio)
      ? "#a5d6a7"
      : "#ef9a9a",
    cursor: estaPagado(index + 1, anio) ? "pointer" : "default",
    "&:hover": estaPagado(index + 1, anio)
      ? { opacity: 0.8 }
      : {},
  }}
>

                    <Typography fontWeight="bold">{mes}</Typography>
                    <Typography variant="body2">
                      {estaPagado(index + 1, anio)
                        ? "Pagado"
                        : "Pendiente"}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Paper>

      {/* ================= BOTON PAGO ================= */}
      <Button variant="contained" color="success" onClick={abrirDialog}>
        Registrar Pago
      </Button>

      {/* ================= DIALOG ================= */}
      <Dialog open={open} onClose={cerrarDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Pago de Cuota</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Mes"
                name="mes"
                value={formPago.mes}
                onChange={handleChange}sx = {{ width: '200px' }}
              >
                {meses.map((mes, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {mes}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Año"
                name="anio"
                type="number"
                value={formPago.anio}
                onChange={handleChange} sx={{width :"100px"}}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Pago"
                name="fecha_pago"
                InputLabelProps={{ shrink: true }}
                value={formPago.fecha_pago}
                onChange={handleChange}sx = {{ width: '200px' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Medio de Pago"
                name="medio"
                value={formPago.medio}
                onChange={handleChange}sx = {{ width: '200px' }}
              >
                <MenuItem value="efectivo">Efectivo</MenuItem>
                <MenuItem value="transferencia">Transferencia</MenuItem>
                <MenuItem value="canje">Canje</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={cerrarDialog}>Cancelar</Button>
          <Button onClick={pagarCuota} variant="contained" color="success">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      {/* ================= DIALOG DETALLE ================= */}
<Dialog
  open={openDetalle}
  onClose={cerrarDetalle}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Detalle del Pago</DialogTitle>

  <DialogContent dividers>
    {detalleCuota && (
      <Box>

        <Typography mb={1}>
          <strong>Mes:</strong>{" "}
          {meses[detalleCuota.mes - 1]}
        </Typography>

        <Typography mb={1}>
          <strong>Año:</strong> {detalleCuota.anio}
        </Typography>

        <Typography mb={1}>
          <strong>Monto:</strong> $
          {detalleCuota.monto}
        </Typography>

        <Typography mb={1}>
          <strong>Fecha:</strong>{" "}
          {detalleCuota.fecha_pago}
        </Typography>

        <Typography mb={1}>
          <strong>Medio:</strong>{" "}
          {detalleCuota.medio}
        </Typography>

      </Box>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={cerrarDetalle} variant="contained">
      Cerrar
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default CuotasSocio;
