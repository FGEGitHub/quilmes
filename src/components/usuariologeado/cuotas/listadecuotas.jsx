import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import servicioFidei from '../../../services/socios';
import * as XLSX from "xlsx";

import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
  Box, Typography, Chip, TextField, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Grid
} from "@mui/material";

import { useTheme, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";

export default function Ingresos() {

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");

  let userContext = null;

  if (loggedUserJSON) {
    try {
      userContext = JSON.parse(loggedUserJSON);
    } catch {
      window.localStorage.removeItem("loggedNoteAppUser");
    }
  }

  const isNivel2 = userContext?.nivel === "2";

  const [inscrip, setInscrip] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [mesCuotaFiltro, setMesCuotaFiltro] = useState("");
  const [anioCuotaFiltro, setAnioCuotaFiltro] = useState("");
  const [filtroCuota, setFiltroCuota] = useState("todos");

  const [soloUltimas, setSoloUltimas] = useState(false);

  const [openPago, setOpenPago] = useState(false);
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);

  const [formPago, setFormPago] = useState({
    mes: "",
    anio: new Date().getFullYear(),
    fecha_pago: "",
    medio: ""
  });

  useEffect(() => {
    traer();
  }, []);

  const traer = async () => {
    const ins = await servicioFidei.traersocios();
    setInscrip(ins);
  };

  const abrirPago = (socio) => {
    setSocioSeleccionado(socio);
    setOpenPago(true);
  };

  const cerrarPago = () => {
    setOpenPago(false);
    setSocioSeleccionado(null);
  };

  const handleChangePago = (e) => {
    setFormPago({
      ...formPago,
      [e.target.name]: e.target.value
    });
  };

  const pagarCuota = async () => {

    if (!formPago.mes) {
      alert("Seleccione mes");
      return;
    }

    try {

      await servicioFidei.pagarcuota({
        socio_id: socioSeleccionado.id,
        ...formPago
      });

      alert("Cuota registrada");

      cerrarPago();
      traer();

    } catch (error) {
      console.error(error);
      alert("Error al registrar pago");
    }

  };

  const descargarExcel = () => {

    if (filteredRows.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const datos = filteredRows.map((row) => ({
      ID: row.id,
      DNI: row.dni,
      Apellido: row.apellido,
      Nombre: row.nombre,
      Disciplina: row.disciplina,
         Equipo: row.equipo,
      Categoria: row.categoria || "",
      Cuota: `${row.mes}/${row.anio}`,
      Ultima: row.es_ultima_cuota ? "SI" : "NO"
    }));

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Socios");

    XLSX.writeFile(workbook, "socios_filtrados.xlsx");

  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredRows = inscrip.filter((row) => {

    const nombreCompleto =
      `${row.nombre} ${row.apellido}`.toLowerCase();

    if (
      searchTerm &&
      !nombreCompleto.includes(searchTerm)
    ) return false;

    if (
      categoriaFiltro &&
      !row.categoria?.toLowerCase().includes(categoriaFiltro.toLowerCase())
    ) return false;

    if (
      mesCuotaFiltro &&
      Number(row.mes) !== Number(mesCuotaFiltro)
    ) return false;

    if (
      anioCuotaFiltro &&
      Number(row.anio) !== Number(anioCuotaFiltro)
    ) return false;

    if (soloUltimas && !row.es_ultima_cuota) {
      return false;
    }

    return true;

  });

  return (
    <>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          px: 2.5,
          py: 2.25,
          background:
            "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
          boxShadow: "0 14px 35px rgba(15,127,134,0.25)",
          color: "#fff",
          border: `1px solid ${alpha("#ffffff", 0.12)}`,
        }}
      >

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>

          <Box sx={{ display: "flex", gap: 1.2 }}>

            <Box
              sx={{
                width: 40,
                height: 44,
                borderRadius: 2,
                background: "rgba(48, 11, 179, 1)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <PeopleRoundedIcon sx={{ color: "#fff" }} />
            </Box>

            <Box>
              <Typography fontWeight={900}>Socios</Typography>
              <Typography fontSize={13}>
                Listado general
              </Typography>
            </Box>

          </Box>

          <Chip
            label={`Cantidad: ${filteredRows.length}`}
            sx={{
              color: "#fff",
              fontWeight: 900,
              background: "rgba(255,255,255,0.14)",
            }}
          />

        </Box>

      </Paper>

      {/* FILTROS */}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, my: 2 }}>

        <TextField
          label="Buscar nombre o apellido"
          value={searchTerm}
          onChange={handleSearch}
          size="small"
          sx={{ width: 220 }}
        />

        <TextField
          label="Categoría"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          size="small"
          sx={{ width: 150 }}
        />

        <TextField
          label="Mes cuota"
          type="number"
          size="small"
          value={mesCuotaFiltro}
          onChange={(e) => setMesCuotaFiltro(e.target.value)}
          sx={{ width: 120 }}
        />

        <TextField
          label="Año cuota"
          type="number"
          size="small"
          value={anioCuotaFiltro}
          onChange={(e) => setAnioCuotaFiltro(e.target.value)}
          sx={{ width: 120 }}
        />

        <TextField
          select
          label="Ver"
          size="small"
          value={soloUltimas ? "ultimas" : "todas"}
          onChange={(e) => setSoloUltimas(e.target.value === "ultimas")}
          sx={{ width: 170 }}
        >
          <MenuItem value="todas">Todas las cuotas</MenuItem>
          <MenuItem value="ultimas">Solo últimas cuotas</MenuItem>
        </TextField>

        <Button
          variant="contained"
          sx={{
            height: 40,
            px: 2,
            borderRadius: "999px",
            backgroundColor: "#16a34a",
            textTransform: "none",
            fontWeight: 600
          }}
          onClick={descargarExcel}
        >
          Descargar Excel
        </Button>

        <Button
          variant="contained"
          sx={{
            height: 40,
            px: 2.5,
            borderRadius: "999px",
            backgroundColor: "rgb(102,80,227)",
            textTransform: "none",
            fontWeight: 600
          }}
          onClick={() => navigate("/usuario/nuevosocio")}
        >
          + Nuevo socio
        </Button>

      </Box>

      {/* TABLA */}

      <Paper>

        <TableContainer>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell><b>ID</b></TableCell>
                <TableCell><b>DNI</b></TableCell>
                <TableCell><b>Apellido</b></TableCell>
                <TableCell><b>Nombre</b></TableCell>
                <TableCell><b>Disciplina</b></TableCell>
                   <TableCell><b>Equipo</b></TableCell>
                <TableCell><b>Cuota</b></TableCell>
                <TableCell><b>Última</b></TableCell>
                <TableCell><b>Acciones</b></TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {filteredRows.map((row) => (

                <TableRow key={row.cuota_id || `${row.id}-${row.mes}-${row.anio}`}>

                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.dni}</TableCell>
                  <TableCell>{row.apellido}</TableCell>
                  <TableCell>{row.nombre}</TableCell>

                  <TableCell>
                    {row.disciplina} {row.categoria ? `- ${row.categoria}` : ''}
                  </TableCell>
<TableCell>{row.equipo}</TableCell>
              <TableCell>

  {row.mes && row.anio ? (
    `${row.mes}/${row.anio}`
  ) : (
    <Chip
      label="Sin pagos"
      size="small"
      color="error"
    />
  )}

</TableCell>

                  <TableCell>

                    <Chip
                      label={row.es_ultima_cuota ? "SI" : "NO"}
                      size="small"
                      color={row.es_ultima_cuota ? "success" : "default"}
                    />

                  </TableCell>

                  <TableCell>

                    <Box sx={{ display: "flex", gap: 1 }}>

                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => abrirPago(row)}
                      >
                        Pagar
                      </Button>

                      <Button
                        size="small"
                        onClick={() =>
                          navigate(`/usuario/socio/${row.id}`)
                        }
                      >
                        Ver
                      </Button>

                    </Box>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </TableContainer>

      </Paper>

    </>
  );
}