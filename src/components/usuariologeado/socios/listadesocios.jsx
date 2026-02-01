import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import servicioFidei from '../../../services/socios';
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField
} from "@mui/material";

import { alpha } from "@mui/material/styles";

import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";

import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination,
  Box, Typography, Chip
} from '@mui/material';

import { useTheme, useMediaQuery } from "@mui/material";

export default function Ingresos() {

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* ---------- USER CONTEXT ---------- */

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

  /* ---------- STATES ---------- */

  const [inscrip, setInscrip] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCuota, setFiltroCuota] = useState("todos");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  /* ---------- DATA ---------- */

  useEffect(() => {
    traer();
  }, []);

  const traer = async () => {
    const ins = await servicioFidei.traersocios();
    setInscrip(ins);
  };


  /* ---------- HELPERS ---------- */

  const estaAlDia = (mes, anio) => {

    if (!mes || !anio) return false;

    const hoy = new Date();

    return (
      mes === hoy.getMonth() + 1 &&
      anio === hoy.getFullYear()
    );
  };


  /* ---------- EVENTS ---------- */

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(0);
  };


  /* ---------- FILTER ---------- */

  const filteredRows = inscrip.filter((row) => {

    const coincide =
      `${row.nombre} ${row.apellido} ${row.dni}`
        .toLowerCase()
        .includes(searchTerm);

    if (!coincide) return false;

    if (filtroCuota === "todos") return true;

    if (filtroCuota === "sinpago") {
      return !row.ultimaCuotaMes;
    }

    if (filtroCuota === "aldia") {
      return estaAlDia(row.ultimaCuotaMes, row.ultimaCuotaAnio);
    }

    if (filtroCuota === "atrasado") {
      return row.ultimaCuotaMes &&
        !estaAlDia(row.ultimaCuotaMes, row.ultimaCuotaAnio);
    }

    return true;
  });


  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


  /* ---------- RENDER ---------- */

  return (
    <>

      {/* HEADER */}

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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2
          }}
        >

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
            label={`Cantidad: ${inscrip.length}`}
            sx={{
              color: "#fff",
              fontWeight: 900,
              background: "rgba(255,255,255,0.14)",
            }}
          />

        </Box>

      </Paper>


      {/* FILTROS */}

      <Box sx={{ display: "flex", gap: 2, my: 2, flexWrap: "wrap" }}>

<TextField
  label="Buscar"
  placeholder="Ej: 30123456 o Pérez"
  helperText="Podés buscar por DNI, nombre o apellido"
  value={searchTerm}
  onChange={handleSearch}
/>

        {isNivel2 && (

          <TextField
            select
            label="Filtrar cuota"
            value={filtroCuota}
            onChange={(e) => setFiltroCuota(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ width: 200 }}
          >
            <option value="todos">Todos</option>
            <option value="aldia">Al día</option>
            <option value="atrasado">Atrasados</option>
            <option value="sinpago">Sin pagos</option>
          </TextField>

        )}

       <Button
  variant="contained"
  sx={{
    color: "white",
    backgroundColor: "hsla(249, 88%, 75%, 1.00)",
    fontSize: "0.90rem",
    borderRadius: "999px",   // ⬅️ clave
    px: 2,                   // padding horizontal
    py: 0.6,                 // padding vertical
    textTransform: "none",   // evita MAYÚSCULAS
  }}
  onClick={() => navigate("/usuario/nuevosocio")}
>
  ➕ Nuevo Socio
</Button>

      </Box>


      {/* TABLA */}

     {isMobile ? (

  /* ========== VISTA TARJETAS (MOBILE) ========== */

  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

    {paginatedRows.map((row) => (

      <Paper
        key={row.id}
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 1.2,
          backgroundColor: "#949299"
        }}
      >

        {/* Header card */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <Typography fontWeight={700}>
          Nro: {row.id} - {row.apellido} {row.nombre}
          </Typography>

          <Chip
            label={`DNI: ${row.dni}`}
            size="small"
            variant="outlined"
          />

        </Box>


        {/* Datos */}

        <Typography fontSize={14}>
          <b>Nombre:</b> {row.nombre}
        </Typography>

        <Typography fontSize={14}>
          <b>Apellido:</b> {row.apellido}
        </Typography>
    <Typography fontSize={14}>
          <b>Disciplina:</b> {row.disciplina} {row.categoria ? `- ${row.categoria}` : '' }
        </Typography>

        {/* Cuota */}

        {isNivel2 && (

          <Box>

            <Typography fontSize={13} fontWeight={600}>
              Última cuota
            </Typography>

            {row.ultimaCuotaMes ? (

              <Chip
                size="small"
                label={`${row.ultimaCuotaMes}/${row.ultimaCuotaAnio}`}
                color={
                  estaAlDia(
                    row.ultimaCuotaMes,
                    row.ultimaCuotaAnio
                  )
                    ? "success"
                    : "warning"
                }
              />

            ) : (

              <Chip
                size="small"
                label="Sin pagos"
                color="error"
              />

            )}

          </Box>

        )}


        {/* Botón */}

        <Button
          variant="contained"
          fullWidth
          size="small"
          sx={{ mt: 1 }}
          onClick={() => navigate(`/usuario/socio/${row.id}`)}
        >
          Ver Detalle
        </Button>

      </Paper>

    ))}


    {paginatedRows.length === 0 && (

      <Typography align="center" sx={{ mt: 2 }}>

        Sin resultados

      </Typography>

    )}

  </Box>

) : (

  /* ========== VISTA TABLA (DESKTOP) ========== */

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


            {isNivel2 && (
              <TableCell><b>Última Cuota</b></TableCell>
            )}

            <TableCell><b>Acciones</b></TableCell>

          </TableRow>

        </TableHead>


        <TableBody>

          {paginatedRows.map((row) => (

            <TableRow key={row.id}>

              <TableCell>{row.id}</TableCell>
              <TableCell>{row.dni}</TableCell>
              <TableCell>{row.apellido}</TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.disciplina} {row.categoria ? `- ${row.categoria}` : ''}</TableCell>

            
              {isNivel2 && (

                <TableCell>

                  {row.ultimaCuotaMes ? (

                    <Chip
                      size="small"
                      label={`${row.ultimaCuotaMes}/${row.ultimaCuotaAnio}`}
                      color={
                        estaAlDia(
                          row.ultimaCuotaMes,
                          row.ultimaCuotaAnio
                        )
                          ? "success"
                          : "warning"
                      }
                    />

                  ) : (

                    <Chip
                      size="small"
                      label="Sin pagos"
                      color="error"
                    />

                  )}

                </TableCell>

              )}


              <TableCell>

                <Button
                  size="small"
                  onClick={() =>
                    navigate(`/usuario/socio/${row.id}`)
                  }
                >
                  Ver
                </Button>

              </TableCell>

            </TableRow>

          ))}


          {paginatedRows.length === 0 && (

            <TableRow>

              <TableCell colSpan={10} align="center">

                Sin resultados

              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>

    </TableContainer>


    <TablePagination
      component="div"
      count={filteredRows.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[10, 50, 100]}
    />

  </Paper>

)}

    </>
  );
}
