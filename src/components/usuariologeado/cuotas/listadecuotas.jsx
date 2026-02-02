import * as React from "react";
import { useState, useEffect } from "react";

import servicioSocios from "../../../services/socios";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery
} from "@mui/material";


const meses = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

export default function CuotasGenerales() {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* ================= STATES ================= */

  const [cuotas, setCuotas] = useState([]);

  const [mesFiltro, setMesFiltro] = useState("");
  const [anioFiltro, setAnioFiltro] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  /* ================= DATA ================= */

  useEffect(() => {
    traerCuotas();
  }, []);

  const traerCuotas = async () => {
    try {
      const res = await servicioSocios.traercuotastodas();
      setCuotas(res);
    } catch (error) {
      console.error(error);
      alert("Error al cargar cuotas");
    }
  };


  /* ================= FILTER ================= */

  const filteredRows = cuotas.filter((row) => {

    if (mesFiltro && Number(row.mes) !== Number(mesFiltro)) {
      return false;
    }

    if (anioFiltro && Number(row.anio) !== Number(anioFiltro)) {
      return false;
    }

    return true;
  });


  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


  /* ================= PAGINATION ================= */

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };


  /* ================= RENDER ================= */

  return (

    <Box>

      {/* ================= HEADER ================= */}

      <Paper sx={{ p: 2.5, mb: 2, borderRadius: 3 }}>

        <Typography fontWeight={900}>
          Registro General de Cuotas
        </Typography>

        <Typography fontSize={13}>
          Pagos por mes y año
        </Typography>

      </Paper>


      {/* ================= FILTROS ================= */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap"
        }}
      >

        {/* MES */}

        <TextField
          select
          label="Mes"
          value={mesFiltro}
          onChange={(e) => setMesFiltro(e.target.value)}
          sx={{ width: 160 }}
        >
          <MenuItem value="">Todos</MenuItem>

          {meses.map((mes, i) => (
            <MenuItem key={i} value={i + 1}>
              {mes}
            </MenuItem>
          ))}
        </TextField>


        {/* AÑO */}

        <TextField
          label="Año"
          type="number"
          value={anioFiltro}
          onChange={(e) => setAnioFiltro(e.target.value)}
          sx={{ width: 120 }}
          placeholder="2026"
        />

      </Box>


      {/* ================= MOBILE ================= */}

      {isMobile ? (

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          {paginatedRows.map((row) => (

            <Paper
              key={row.id}
              sx={{ p: 2, borderRadius: 3 }}
            >

              <Typography fontWeight={700}>
                {row.apellido} {row.nombre}
              </Typography>

              <Typography fontSize={14}>
                <b>Disciplina:</b>{" "}
                {row.disciplina} {row.categoria}
              </Typography>

              <Typography fontSize={14}>
                <b>Periodo:</b>{" "}
                {meses[row.mes - 1]} / {row.anio}
              </Typography>

              <Typography fontSize={14}>
                <b>Monto:</b> ${row.monto}
              </Typography>

              <Typography fontSize={14}>
                <b>Medio:</b> {row.medio}
              </Typography>

              <Chip
                size="small"
                label={row.fecha_pago}
                sx={{ mt: 1 }}
              />

            </Paper>

          ))}

        </Box>

      ) : (

        /* ================= DESKTOP ================= */

        <Paper>

          <TableContainer>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell><b>Apellido</b></TableCell>
                  <TableCell><b>Nombre</b></TableCell>
                  <TableCell><b>Disciplina</b></TableCell>
                  <TableCell><b>Mes/Año</b></TableCell>
                  <TableCell><b>Monto</b></TableCell>
                  <TableCell><b>Medio</b></TableCell>
                  <TableCell><b>Fecha</b></TableCell>

                </TableRow>

              </TableHead>


              <TableBody>

                {paginatedRows.map((row) => (

                  <TableRow key={row.id}>

                    <TableCell>{row.apellido}</TableCell>
                    <TableCell>{row.nombre}</TableCell>

                    <TableCell>
                      {row.disciplina} {row.categoria}
                    </TableCell>

                    <TableCell>
                      {meses[row.mes - 1]} / {row.anio}
                    </TableCell>

                    <TableCell>${row.monto}</TableCell>

                    <TableCell>{row.medio}</TableCell>

                    <TableCell>{row.fecha_pago}</TableCell>

                  </TableRow>

                ))}


                {paginatedRows.length === 0 && (

                  <TableRow>

                    <TableCell colSpan={7} align="center">

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
            rowsPerPageOptions={[10, 25, 50]}
          />

        </Paper>

      )}

    </Box>
  );
}
