import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import servicioFidei from '../../../services/socios';

import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination,
  Box, Typography, Chip, TextField, Button
} from '@mui/material';

import { useTheme, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";

export default function Ingresos() {

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* USER */

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

  /* STATES */

  const [inscrip, setInscrip] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const [mesCuotaFiltro, setMesCuotaFiltro] = useState("");
  const [anioCuotaFiltro, setAnioCuotaFiltro] = useState("");

  const [filtroCuota, setFiltroCuota] = useState("todos");

  const [mostrarTodos, setMostrarTodos] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* DATA */

  useEffect(() => {
    traer();
  }, []);

  const traer = async () => {
    const ins = await servicioFidei.traersocios();
    setInscrip(ins);
  };

  /* HELPERS */

  const estaAlDia = (mes, anio) => {

    if (!mes || !anio) return false;

    const hoy = new Date();

    return (
      mes === hoy.getMonth() + 1 &&
      anio === hoy.getFullYear()
    );

  };

  /* EVENTS */

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

  /* FILTER */

  const filteredRows = inscrip.filter((row) => {

    if (!mostrarTodos && searchTerm === "") return false;

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
      Number(row.ultimaCuotaMes) !== Number(mesCuotaFiltro)
    ) return false;

    if (
      anioCuotaFiltro &&
      Number(row.ultimaCuotaAnio) !== Number(anioCuotaFiltro)
    ) return false;

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

  /* RENDER */

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

        {isNivel2 && (
          <TextField
            select
            label="Estado cuota"
            size="small"
            value={filtroCuota}
            onChange={(e) => setFiltroCuota(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ width: 160 }}
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
            height: 40,
            px: 2,
            borderRadius: "999px",
            backgroundColor: "#2563EB",
            textTransform: "none",
            fontWeight: 600
          }}
          onClick={() => setMostrarTodos(true)}
        >
          Ver todos
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

                  <TableCell>
                    {row.disciplina} {row.categoria ? `- ${row.categoria}` : ''}
                  </TableCell>

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

    </>
  );
}