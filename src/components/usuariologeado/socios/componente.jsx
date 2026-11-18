
import React, { useEffect, useMemo, useState } from "react";
import servicioSocios from "../../../services/socios";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  InputAdornment,
  Stack,
  Alert,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";

const azul = "#1849a9";

const cardStyle = {
  border: "1px solid #e3e8f1",
  borderRadius: 3,
  boxShadow: "none",
  height: "100%",
};

const Socios = () => {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openFicha, setOpenFicha] = useState(false);
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [nuevoSocio, setNuevoSocio] = useState({
    dni: "",
    apellido: "",
    nombre: "",
    fecha_nacimiento: "",
    genero: "",
    telefono: "",
    email: "",
    direccion: "",
    fecha_inscripcion: new Date().toISOString().split("T")[0],
  });

  // ==========================================
  // TRAER SOCIOS
  // ==========================================

  const traerSocios = async () => {
    try {
      setLoading(true);
      setError("");

      const respuesta = await servicioSocios.traersocios();

      const lista =
        Array.isArray(respuesta)
          ? respuesta
          : respuesta?.socios ||
            respuesta?.data ||
            respuesta?.resultado ||
            [];

      setSocios(lista);

    } catch (err) {
      console.error("Error al traer socios:", err);
      setError("No se pudieron cargar los socios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    traerSocios();
  }, []);

  // ==========================================
  // ESTADOS Y FILTROS
  // ==========================================

  const obtenerEstado = (socio) => {
    return (
      socio.estado_cuota ||
      socio.estado ||
      "Pendiente"
    );
  };

  const sociosFiltrados = useMemo(() => {
    return socios.filter((socio) => {
      const texto = busqueda.toLowerCase();

      const nombreCompleto =
        `${socio.apellido || ""} ${socio.nombre || ""}`.toLowerCase();

      const coincideBusqueda =
        nombreCompleto.includes(texto) ||
        String(socio.dni || "").includes(texto) ||
        String(socio.numero_socio || "").includes(texto);

      const estado = obtenerEstado(socio).toLowerCase();

      const coincideEstado =
        filtroEstado === "Todos" ||
        estado === filtroEstado.toLowerCase();

      return coincideBusqueda && coincideEstado;
    });
  }, [socios, busqueda, filtroEstado]);

  // ==========================================
  // INDICADORES
  // ==========================================

  const totalSocios = socios.length;

  const sociosAlDia = socios.filter((s) => {
    const estado = obtenerEstado(s).toLowerCase();
    return estado === "al día" || estado === "aldia" ||
      estado === "pagado";
  }).length;

  const sociosPendientes = socios.filter((s) => {
    const estado = obtenerEstado(s).toLowerCase();
    return estado === "pendiente" || estado === "deudor";
  }).length;

  const obtenerColor = (estado) => {
    const valor = estado.toLowerCase();

    if (valor === "al día" || valor === "aldia" || valor === "pagado") {
      return "success";
    }

    if (valor === "parcial") return "warning";

    return "error";
  };

  // ==========================================
  // NUEVO SOCIO
  // ==========================================

  const handleChange = (e) => {
    setNuevoSocio({
      ...nuevoSocio,
      [e.target.name]: e.target.value,
    });
  };

  const guardarSocio = async () => {
    try {
      setGuardando(true);

      const respuesta = await servicioSocios.agregarsocio(nuevoSocio);

      console.log("Socio registrado:", respuesta);

      setOpenNuevo(false);

      setNuevoSocio({
        dni: "",
        apellido: "",
        nombre: "",
        fecha_nacimiento: "",
        genero: "",
        telefono: "",
        email: "",
        direccion: "",
        fecha_inscripcion: new Date().toISOString().split("T")[0],
      });

      await traerSocios();

    } catch (err) {
      console.error("Error al guardar socio:", err);
      setError("No se pudo registrar el socio.");
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // FICHA DEL SOCIO
  // ==========================================

  const verFicha = (socio) => {
    setSocioSeleccionado(socio);
    setOpenFicha(true);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1500, mx: "auto" }}>

      {/* ENCABEZADO */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Socios
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Administración y padrón societario del club.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddAlt1Icon />}
          onClick={() => setOpenNuevo(true)}
          sx={{
            backgroundColor: azul,
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            fontWeight: 700,
          }}
        >
          Nuevo socio
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* INDICADORES */}

      <Grid container spacing={2} mb={3}>

        {[
          {
            titulo: "Socios activos",
            valor: totalSocios,
            icono: <PeopleAltOutlinedIcon />,
            color: azul,
          },
          {
            titulo: "Al día",
            valor: sociosAlDia,
            color: "#178a52",
          },
          {
            titulo: "Pendientes",
            valor: sociosPendientes,
            color: "#c43c45",
          },
          {
            titulo: "Cobrado",
            valor: "XX",
            descripcion: "Recaudación del período",
            color: "#b87808",
          },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography color="text.secondary" fontSize={13}>
                  {item.titulo}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{ color: item.color, my: 1 }}
                >
                  {item.valor}
                </Typography>

                {item.descripcion && (
                  <Typography fontSize={12} color="text.secondary">
                    {item.descripcion}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}

      </Grid>

      {/* PADRÓN */}

      <Card sx={cardStyle}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>

          <Box mb={2}>
            <Typography variant="h6" fontWeight={800}>
              Padrón societario
            </Typography>

            <Typography color="text.secondary" fontSize={13}>
              Listado general de socios registrados.
            </Typography>
          </Box>

          {/* BUSCADOR Y FILTROS */}

          <Grid container spacing={2} mb={2}>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por nombre, apellido, DNI o número de socio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Estado de cuota"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <MenuItem value="Todos">Todos los estados</MenuItem>
                <MenuItem value="Al día">Al día</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Parcial">Parcial</MenuItem>
              </TextField>
            </Grid>

          </Grid>

          <Divider sx={{ mb: 1 }} />

          {/* LISTADO */}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress />
            </Box>
          ) : sociosFiltrados.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <PeopleAltOutlinedIcon
                sx={{ fontSize: 45, color: "#aab2c0" }}
              />

              <Typography fontWeight={700} mt={1}>
                No se encontraron socios
              </Typography>

              <Typography color="text.secondary" fontSize={13}>
                Probá modificando los filtros de búsqueda.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Box sx={{ minWidth: 750 }}>

                {/* CABECERA */}

                <Grid
                  container
                  sx={{
                    backgroundColor: "#f6f8fc",
                    p: 1.5,
                    borderRadius: 2,
                    mb: 1,
                  }}
                >
                  <Grid item xs={1.5}>
                    <Typography fontSize={11} fontWeight={800} color="text.secondary">
                      N.º SOCIO
                    </Typography>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography fontSize={11} fontWeight={800} color="text.secondary">
                      SOCIO
                    </Typography>
                  </Grid>

                  <Grid item xs={2}>
                    <Typography fontSize={11} fontWeight={800} color="text.secondary">
                      DNI
                    </Typography>
                  </Grid>

                  <Grid item xs={2}>
                    <Typography fontSize={11} fontWeight={800} color="text.secondary">
                      TELÉFONO
                    </Typography>
                  </Grid>

                  <Grid item xs={1.5}>
                    <Typography fontSize={11} fontWeight={800} color="text.secondary">
                      ESTADO
                    </Typography>
                  </Grid>

                  <Grid item xs={2}>
                    <Typography fontSize={11} fontWeight={800} color="text.secondary">
                      ACCIONES
                    </Typography>
                  </Grid>
                </Grid>

                {/* FILAS */}

                {sociosFiltrados.map((socio, index) => {
                  const estado = obtenerEstado(socio);

                  return (
                    <Grid
                      container
                      key={socio.id || socio.dni || index}
                      alignItems="center"
                      sx={{
                        py: 1.8,
                        px: 1.5,
                        borderBottom: "1px solid #edf0f5",
                        "&:hover": {
                          backgroundColor: "#f8faff",
                        },
                      }}
                    >

                      <Grid item xs={1.5}>
                        <Typography fontWeight={700} fontSize={13}>
                          {socio.numero_socio || socio.id || "XX"}
                        </Typography>
                      </Grid>

                      <Grid item xs={3}>
                        <Typography fontWeight={700} fontSize={13}>
                          {socio.apellido}, {socio.nombre}
                        </Typography>
                      </Grid>

                      <Grid item xs={2}>
                        <Typography fontSize={13}>
                          {socio.dni || "XX"}
                        </Typography>
                      </Grid>

                      <Grid item xs={2}>
                        <Typography fontSize={13}>
                          {socio.telefono || "XX"}
                        </Typography>
                      </Grid>

                      <Grid item xs={1.5}>
                        <Chip
                          label={estado}
                          color={obtenerColor(estado)}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityOutlinedIcon />}
                          onClick={() => verFicha(socio)}
                          sx={{
                            textTransform: "none",
                            fontSize: 12,
                          }}
                        >
                          Ver ficha
                        </Button>
                      </Grid>

                    </Grid>
                  );
                })}

              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Typography color="text.secondary" fontSize={12}>
              Mostrando {sociosFiltrados.length} de {socios.length} socios
            </Typography>
          </Box>

        </CardContent>
      </Card>

      {/* =====================================
          MODAL NUEVO SOCIO
      ===================================== */}

      <Dialog
        open={openNuevo}
        onClose={() => setOpenNuevo(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={800} variant="h6">
              Registrar nuevo socio
            </Typography>

            <IconButton onClick={() => setOpenNuevo(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2} mt={0}>

            <Grid item xs={12} sm={6}>
              <TextField
                label="DNI"
                name="dni"
                fullWidth
                size="small"
                value={nuevoSocio.dni}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de inscripción"
                name="fecha_inscripcion"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={nuevoSocio.fecha_inscripcion}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido"
                name="apellido"
                fullWidth
                size="small"
                value={nuevoSocio.apellido}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                name="nombre"
                fullWidth
                size="small"
                value={nuevoSocio.nombre}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de nacimiento"
                name="fecha_nacimiento"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={nuevoSocio.fecha_nacimiento}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Género"
                name="genero"
                fullWidth
                size="small"
                value={nuevoSocio.genero}
                onChange={handleChange}
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography fontWeight={700} fontSize={14} mb={1}>
                Información de contacto
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                name="telefono"
                fullWidth
                size="small"
                value={nuevoSocio.telefono}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                size="small"
                value={nuevoSocio.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Dirección / Barrio"
                name="direccion"
                fullWidth
                size="small"
                value={nuevoSocio.direccion}
                onChange={handleChange}
              />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenNuevo(false)}
            color="inherit"
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            disabled={
              guardando ||
              !nuevoSocio.dni ||
              !nuevoSocio.apellido ||
              !nuevoSocio.nombre
            }
            onClick={guardarSocio}
            sx={{ backgroundColor: azul }}
          >
            {guardando ? "Guardando..." : "Guardar socio"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================
          MODAL FICHA SOCIO
      ===================================== */}

      <Dialog
        open={openFicha}
        onClose={() => setOpenFicha(false)}
        fullWidth
        maxWidth="sm"
      >
        {socioSeleccionado && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={800} variant="h6">
                    {socioSeleccionado.apellido}, {socioSeleccionado.nombre}
                  </Typography>

                  <Typography color="text.secondary" fontSize={13}>
                    Socio N.º {socioSeleccionado.numero_socio || "XX"}
                  </Typography>
                </Box>

                <IconButton onClick={() => setOpenFicha(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent dividers>

              <Typography fontWeight={800} mb={2}>
                Datos personales
              </Typography>

              {[
                ["DNI", socioSeleccionado.dni],
                ["Fecha de nacimiento", socioSeleccionado.fecha_nacimiento],
                ["Género", socioSeleccionado.genero],
                ["Teléfono", socioSeleccionado.telefono],
                ["Email", socioSeleccionado.email],
                ["Dirección", socioSeleccionado.direccion],
                ["Fecha de inscripción", socioSeleccionado.fecha_inscripcion],
              ].map(([titulo, valor]) => (
                <Box
                  key={titulo}
                  display="flex"
                  justifyContent="space-between"
                  gap={2}
                  py={1.3}
                  borderBottom="1px solid #edf0f5"
                >
                  <Typography color="text.secondary" fontSize={13}>
                    {titulo}
                  </Typography>

                  <Typography fontWeight={600} fontSize={13} textAlign="right">
                    {valor || "XX"}
                  </Typography>
                </Box>
              ))}

              <Typography fontWeight={800} mt={3} mb={2}>
                Estado societario
              </Typography>

              <Chip
                label={obtenerEstado(socioSeleccionado)}
                color={obtenerColor(obtenerEstado(socioSeleccionado))}
              />

            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenFicha(false)}>
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </Box>
  );
};

export default Socios;
