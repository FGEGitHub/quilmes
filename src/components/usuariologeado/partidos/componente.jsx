import React, { useState, useEffect, useCallback } from "react";
import servicioSocios from "../../../services/socios";

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
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Divider,
} from "@mui/material";

const formatoMoneda = (valor) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(Number(valor) || 0);
};

const formatoFecha = (fecha) => {
  if (!fecha) return "-";

  const fechaTexto = String(fecha).slice(0, 10);

  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)) {
    const [anio, mes, dia] = fechaTexto.split("-");
    return `${dia}/${mes}/${anio}`;
  }

  return fechaTexto;
};

const obtenerError = (error) => {
  return (
    error?.response?.data?.mensaje ||
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    "Ocurrió un error inesperado."
  );
};

const Partidos = () => {
  // Estados principales
  const [partidos, setPartidos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [resumen, setResumen] = useState({
    partidos_registrados: 0,
    recaudacion: 0,
    gastos: 0,
    resultado_neto: 0,
  });

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Modal de creación
  const [open, setOpen] = useState(false);

  // Notificaciones
  const [notificacion, setNotificacion] = useState({
    open: false,
    mensaje: "",
    severidad: "success",
  });

  // Formulario
  const formularioInicial = {
    rival: "",
    categoria_id: "",
    fecha: "",
    hora: "",
    condicion: "local",
    recaudacion: "",
    gastos: "",
    observaciones: "",
  };

  const [formulario, setFormulario] = useState(formularioInicial);

  // Manejo de notificaciones
  const mostrarNotificacion = (mensaje, severidad = "success") => {
    setNotificacion({
      open: true,
      mensaje,
      severidad,
    });
  };

  // Cerrar modal
  const cerrarModal = () => {
    if (guardando) return;

    setOpen(false);
    setFormulario(formularioInicial);
  };

  // Actualizar campos del formulario
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((previo) => ({
      ...previo,
      [name]: value,
    }));
  };

  // Obtener información desde el backend
  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);

      const [respuestaPartidos, respuestaResumen, respuestaCategorias] =
        await Promise.all([
          servicioSocios.quilmesListarPartidos(),
          servicioSocios.quilmesResumenPartidos(),
          servicioSocios.quilmesListarCategorias(),
        ]);

      // Partidos
      const listaPartidos = Array.isArray(respuestaPartidos)
        ? respuestaPartidos
        : respuestaPartidos?.partidos || respuestaPartidos?.data || [];

      setPartidos(listaPartidos);

      // Categorías
      const listaCategorias = Array.isArray(respuestaCategorias)
        ? respuestaCategorias
        : respuestaCategorias?.categorias ||
          respuestaCategorias?.data ||
          [];

      setCategorias(listaCategorias);

      // Resumen
      const datosResumen =
        respuestaResumen?.resumen || respuestaResumen?.data || respuestaResumen;

      setResumen({
        partidos_registrados: Number(
          datosResumen?.partidos_registrados ??
            datosResumen?.total_partidos ??
            datosResumen?.cantidad_partidos ??
            0
        ),
        recaudacion: Number(
          datosResumen?.recaudacion ??
            datosResumen?.total_recaudacion ??
            datosResumen?.ingresos ??
            0
        ),
        gastos: Number(
          datosResumen?.gastos ??
            datosResumen?.total_gastos ??
            0
        ),
        resultado_neto: Number(
          datosResumen?.resultado_neto ??
            datosResumen?.resultado ??
            datosResumen?.balance ??
            0
        ),
      });
    } catch (error) {
      console.error("Error cargando partidos:", error);

      mostrarNotificacion(
        `No se pudieron cargar los datos: ${obtenerError(error)}`,
        "error"
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Obtener ID del partido creado en distintas respuestas posibles
  const obtenerIdPartido = (respuesta) => {
    return (
      respuesta?.id ??
      respuesta?.partido_id ??
      respuesta?.insertId ??
      respuesta?.partido?.id ??
      respuesta?.data?.id ??
      respuesta?.data?.partido_id ??
      respuesta?.data?.insertId ??
      null
    );
  };

  // Guardar partido y sus movimientos económicos
  const guardarPartido = async () => {
    if (!formulario.rival.trim()) {
      mostrarNotificacion("Ingresá el nombre del rival.", "warning");
      return;
    }

    if (!formulario.categoria_id) {
      mostrarNotificacion("Seleccioná una categoría.", "warning");
      return;
    }

    if (!formulario.fecha) {
      mostrarNotificacion("Seleccioná la fecha del partido.", "warning");
      return;
    }

    const recaudacion = Number(formulario.recaudacion || 0);
    const gastos = Number(formulario.gastos || 0);

    if (
      !Number.isFinite(recaudacion) ||
      !Number.isFinite(gastos) ||
      recaudacion < 0 ||
      gastos < 0
    ) {
      mostrarNotificacion(
        "La recaudación y los gastos deben ser montos válidos y no negativos.",
        "warning"
      );
      return;
    }

    try {
      setGuardando(true);

      // 1. Crear el partido
      const respuesta = await servicioSocios.quilmesCrearPartido({
        categoria_id: Number(formulario.categoria_id),
        rival: formulario.rival.trim(),
        fecha: formulario.fecha,
        hora: formulario.hora || null,
        condicion: formulario.condicion,
        estado: "programado",
        observaciones: formulario.observaciones.trim() || null,
      });

      const partidoId = obtenerIdPartido(respuesta);

      // 2. Registrar recaudación como ingreso
      if (recaudacion > 0) {
        if (!partidoId) {
          throw new Error(
            "El partido se creó, pero el backend no devolvió su ID. No se pudieron registrar los movimientos."
          );
        }

        await servicioSocios.quilmesAgregarMovimiento(partidoId, {
          tipo: "ingreso",
          concepto: "Recaudación",
          monto: recaudacion,
          fecha: formulario.fecha,
          observaciones: "Recaudación inicial del partido",
        });
      }

      // 3. Registrar gastos
      if (gastos > 0) {
        if (!partidoId) {
          throw new Error(
            "El partido se creó, pero no se obtuvo su ID para registrar los gastos."
          );
        }

        await servicioSocios.quilmesAgregarMovimiento(partidoId, {
          tipo: "gasto",
          concepto: "Gastos del partido",
          monto: gastos,
          fecha: formulario.fecha,
          observaciones: "Gastos iniciales del partido",
        });
      }

      setOpen(false);
      setFormulario(formularioInicial);

      mostrarNotificacion("Partido registrado correctamente.");

      // Actualizar tarjetas y lista
      await cargarDatos();
    } catch (error) {
      console.error("Error guardando partido:", error);

      mostrarNotificacion(
        `No se pudo completar el registro: ${obtenerError(error)}`,
        "error"
      );

      // Si el partido llegó a crearse antes del error,
      // volver a cargar los datos del backend.
      await cargarDatos();
    } finally {
      setGuardando(false);
    }
  };

  // Obtener valores para mostrar un partido
  const obtenerCategoria = (partido) => {
    return (
      partido.categoria ||
      partido.nombre_categoria ||
      partido.categoria_nombre ||
      categorias.find(
        (categoria) =>
          Number(categoria.id) === Number(partido.categoria_id)
      )?.nombre ||
      "Categoría"
    );
  };

  const obtenerRecaudacion = (partido) => {
    return Number(
      partido.recaudacion ??
        partido.total_ingresos ??
        partido.ingresos ??
        partido.total_recaudacion ??
        0
    );
  };

  const obtenerGastos = (partido) => {
    return Number(
      partido.gastos ??
        partido.total_gastos ??
        partido.egresos ??
        0
    );
  };

  const obtenerResultado = (partido) => {
    if (partido.resultado_neto !== undefined) {
      return Number(partido.resultado_neto);
    }

    if (partido.resultado !== undefined) {
      return Number(partido.resultado);
    }

    return obtenerRecaudacion(partido) - obtenerGastos(partido);
  };

  const obtenerEstado = (estado) => {
    const estados = {
      programado: {
        texto: "Programado",
        color: "info",
      },
      jugado: {
        texto: "Jugado",
        color: "success",
      },
      suspendido: {
        texto: "Suspendido",
        color: "warning",
      },
      cancelado: {
        texto: "Cancelado",
        color: "error",
      },
    };

    return estados[estado] || {
      texto: estado || "Sin estado",
      color: "default",
    };
  };

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
            Partidos y recaudaciones
          </Typography>

          <Typography
            sx={{
              color: "#6d778a",
              marginTop: "5px",
            }}
          >
            Cada partido concentra recaudación, gastos y resultado neto.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: "#1849a9",
            borderRadius: "10px",
            padding: "9px 16px",
            fontWeight: 800,
            textTransform: "none",
            whiteSpace: "nowrap",

            "&:hover": {
              backgroundColor: "#0f3d91",
            },
          }}
        >
          + Nuevo partido
        </Button>
      </Box>

      {/* RESUMEN */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "14px",
          marginBottom: "25px",

          "@media (max-width: 850px)": {
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          },

          "@media (max-width: 480px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        {[
          {
            titulo: "Partidos registrados",
            valor: resumen.partidos_registrados,
            color: "#172033",
          },
          {
            titulo: "Recaudación",
            valor: formatoMoneda(resumen.recaudacion),
            color: "#172033",
          },
          {
            titulo: "Gastos",
            valor: formatoMoneda(resumen.gastos),
            color: "#172033",
          },
          {
            titulo: "Resultado neto",
            valor: formatoMoneda(resumen.resultado_neto),
            color: resumen.resultado_neto >= 0 ? "#178a52" : "#d32f2f",
          },
        ].map((item) => (
          <Box
            key={item.titulo}
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #e3e8f1",
              borderRadius: "17px",
              padding: "18px",
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: "#6d778a",
              }}
            >
              {item.titulo}
            </Typography>

            <Typography
              sx={{
                fontSize: 25,
                fontWeight: 900,
                marginTop: "6px",
                color: item.color,
                overflowWrap: "anywhere",
              }}
            >
              {cargando ? "..." : item.valor}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* TÍTULO DE LA LISTA */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          marginBottom: "12px",
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 900,
            color: "#172033",
          }}
        >
          Partidos recientes
        </Typography>

        <Button
          onClick={cargarDatos}
          disabled={cargando}
          sx={{
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Actualizar
        </Button>
      </Box>

      {/* CARGA */}
      {cargando && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* LISTA DE PARTIDOS */}
      {!cargando && (
        <>
          {partidos.length === 0 ? (
            <Box
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #e3e8f1",
                borderRadius: "17px",
                padding: "35px 20px",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#172033",
                }}
              >
                Todavía no hay partidos registrados
              </Typography>

              <Typography
                sx={{
                  color: "#6d778a",
                  marginTop: "8px",
                }}
              >
                Usá el botón “Nuevo partido” para comenzar.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px",

                "@media (max-width: 850px)": {
                  gridTemplateColumns: "1fr",
                },
              }}
            >
              {partidos.map((partido) => {
                const recaudacion = obtenerRecaudacion(partido);
                const gastos = obtenerGastos(partido);
                const resultado = obtenerResultado(partido);
                const estado = obtenerEstado(partido.estado);

                return (
                  <Box
                    key={partido.id}
                    sx={{
                      backgroundColor: "#fff",
                      border: "1px solid #e3e8f1",
                      borderRadius: "17px",
                      padding: "18px",
                      minWidth: 0,
                    }}
                  >
                    {/* CATEGORÍA Y ESTADO */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          letterSpacing: ".1em",
                          color: "#6d778a",
                          fontWeight: 800,
                        }}
                      >
                        {obtenerCategoria(partido)}
                      </Typography>

                      <Chip
                        label={estado.texto}
                        color={estado.color}
                        size="small"
                      />
                    </Box>

                    {/* PARTIDO */}
                    <Typography
                      sx={{
                        fontSize: 23,
                        fontWeight: 800,
                        color: "#172033",
                        marginTop: "8px",
                        overflowWrap: "anywhere",
                      }}
                    >
                      Quilmes vs. {partido.rival}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#6d778a",
                        marginTop: "5px",
                        marginBottom: "12px",
                      }}
                    >
                      {formatoFecha(partido.fecha)}
                      {partido.hora ? ` · ${String(partido.hora).slice(0, 5)} hs` : ""}
                      {partido.condicion
                        ? ` · ${
                            partido.condicion.charAt(0).toUpperCase() +
                            partido.condicion.slice(1)
                          }`
                        : ""}
                    </Typography>

                    <Divider />

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
                      <Typography>Recaudación</Typography>

                      <Typography fontWeight={700}>
                        {formatoMoneda(recaudacion)}
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
                      <Typography>Gastos</Typography>

                      <Typography fontWeight={700}>
                        {formatoMoneda(gastos)}
                      </Typography>
                    </Box>

                    {/* RESULTADO NETO */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        padding: "12px 0",
                      }}
                    >
                      <Typography>Resultado neto</Typography>

                      <Typography
                        sx={{
                          fontWeight: 900,
                          color: resultado >= 0 ? "#178a52" : "#d32f2f",
                        }}
                      >
                        {resultado > 0 ? "+" : ""}
                        {formatoMoneda(resultado)}
                      </Typography>
                    </Box>

                    {/* OBSERVACIONES */}
                    {partido.observaciones && (
                      <Typography
                        sx={{
                          color: "#6d778a",
                          fontSize: 13,
                          marginTop: "6px",
                        }}
                      >
                        {partido.observaciones}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </>
      )}

      {/* MODAL NUEVO PARTIDO */}
      <Dialog
        open={open}
        onClose={cerrarModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: "#172033",
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
              name="rival"
              label="Rival"
              value={formulario.rival}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ maxLength: 150 }}
            />

            <TextField
              select
              name="categoria_id"
              label="Categoría"
              value={formulario.categoria_id}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="">
                Seleccionar categoría
              </MenuItem>

              {categorias.map((categoria) => (
                <MenuItem
                  key={categoria.id}
                  value={String(categoria.id)}
                >
                  {categoria.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="fecha"
              label="Fecha"
              type="date"
              value={formulario.fecha}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />

            <TextField
              name="hora"
              label="Hora del partido"
              type="time"
              value={formulario.hora}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              select
              name="condicion"
              label="Condición"
              value={formulario.condicion}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="local">Local</MenuItem>
              <MenuItem value="visitante">Visitante</MenuItem>
              <MenuItem value="neutral">Cancha neutral</MenuItem>
            </TextField>

            <TextField
              name="recaudacion"
              label="Recaudación inicial"
              type="number"
              value={formulario.recaudacion}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 0, step: "0.01" }}
              helperText="Podés dejarlo en blanco o en cero."
            />

            <TextField
              name="gastos"
              label="Gastos iniciales"
              type="number"
              value={formulario.gastos}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 0, step: "0.01" }}
              helperText="Podés dejarlo en blanco o en cero."
            />

            <TextField
              name="observaciones"
              label="Observaciones"
              value={formulario.observaciones}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={2}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "16px 24px",
            gap: "8px",
          }}
        >
          <Button
            onClick={cerrarModal}
            disabled={guardando}
            sx={{
              color: "#172033",
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={guardarPartido}
            disabled={guardando}
            sx={{
              backgroundColor: "#1849a9",
              textTransform: "none",
              fontWeight: 700,
              minWidth: "145px",

              "&:hover": {
                backgroundColor: "#0f3d91",
              },
            }}
          >
            {guardando ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Guardar partido"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* NOTIFICACIONES */}
      <Snackbar
        open={notificacion.open}
        autoHideDuration={5000}
        onClose={() =>
          setNotificacion((previo) => ({
            ...previo,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={notificacion.severidad}
          variant="filled"
          onClose={() =>
            setNotificacion((previo) => ({
              ...previo,
              open: false,
            }))
          }
        >
          {notificacion.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Partidos;