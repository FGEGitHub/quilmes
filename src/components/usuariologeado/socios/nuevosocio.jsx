import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import servicioSocios from "../../../services/socios";

const sectionStyle = {
  border: "1px solid #c62828",
  borderRadius: 1,
  mb: 3,
};

const sectionHeader = {
  backgroundColor: "#111827",
  px: 2,
  py: 0.5,
  fontWeight: "bold",
  fontSize: 14,
  color: "#fdfdfd",
};

const sectionBody = {
  p: 2,
};
const disciplinas = {
  Futbol: {
    Masculino: ["Primera", "Reserva"],
    Femenino: ["Primera"],
    Infantil: ["Sub 9", "Sub 11", "Sub 13", "Sub 15", "Sub 17"]
  },
  Hockey: {
    Femenino: ["Damas", "Mamis"],
    Caballeros: ["Primera"],
    Infantil: ["Sub 12", "Sub 14", "Sub 16"]
  },
  Cestoball: {
    Primera: ["Primera A", "Primera B"],
    Maxi: ["Primera A", "Primera B"],
    Infantil: ["Sub 10", "Sub 12", "Sub 14", "Sub 17"]
  }
};

const SocioNuevo = () => {
  const navigate = useNavigate();

  const [socio, setSocio] = useState({
    // Datos personales
    dni: "",
    apellido: "",
    nombre: "",
    fecha_nacimiento: "",
    genero: "",

    // Información deportiva
    disciplina: "",
    categoria: "",
    equipo: "",
    condicion_deportiva: "",
    estado_deportivo: "",

    // Contacto
    telefono: "",
    email: "",
    direccion: "",

    // Tutor
    tiene_tutor: false,
    tutor_nombre: "",
    tutor_dni: "",
    tutor_telefono: "",
    tutor_email: "",
    vinculo: "",

    // Salud
    apto_medico: "",
    venc_apto: "",
    obra_social: "",
    tel_emergencia: "",
    obs_medicas: "",

    // Consentimientos
    autorizacion_imagen: "",
    autorizacion_viajes: "",

    // Control interno
    profesor_carga: "",
    fecha_inscripcion: "",
    obs_internas: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSocio({
      ...socio,
      [name]: type === "checkbox" ? checked : value
    });
  };
const handleDisciplinaChange = (e) => {
  setSocio({
    ...socio,
    disciplina: e.target.value,
    categoria: "",
    equipo: ""
  });
};

const handleCategoriaChange = (e) => {
  setSocio({
    ...socio,
    categoria: e.target.value,
    equipo: ""
  });
};

  const handleGuardar = async () => {
    try {
      await servicioSocios.agregarsocio(socio);
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Error al guardar socio");
    }
  };

  return (
    <Card sx={{ maxWidth: 1100, margin: "auto", mt: 4 }}>
      <CardContent>

        <Typography variant="h6" align="center" sx={{ fontWeight: "bold", mb: 2 }}>
          REGISTRO DE SOCIO
        </Typography>

        {/* 1. DATOS PERSONALES */}
        <Box sx={sectionStyle}>
          <Box sx={sectionHeader}>1) DATOS PERSONALES</Box>
          <Box sx={sectionBody}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField label="DNI" name="dni" fullWidth size="small" value={socio.dni} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Apellido" name="apellido" fullWidth size="small" value={socio.apellido} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Nombre" name="nombre" fullWidth size="small" value={socio.nombre} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField type="date" label="Fecha de nacimiento" name="fecha_nacimiento"
                  InputLabelProps={{ shrink: true }} fullWidth size="small"
                  value={socio.fecha_nacimiento} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField select label="Sexo / Género" name="genero" fullWidth size="small"
                  value={socio.genero} onChange={handleChange}>
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* 2. INFORMACIÓN DEPORTIVA */}
       <Box sx={sectionStyle}>
  <Box sx={sectionHeader}>2) INFORMACIÓN DEPORTIVA</Box>
  <Box sx={sectionBody}>
    <Grid container spacing={2}>

      {/* DISCIPLINA */}
      <Grid item xs={12} sm={4}>
        <TextField
          select
          label="Disciplina"
          name="disciplina"
          fullWidth
          size="small"
          defaultValue="Seleccionar"
          value={socio.disciplina}
          onChange={handleDisciplinaChange}
        >
          <MenuItem value="Futbol">Fútbol</MenuItem>
          <MenuItem value="Hockey">Hockey</MenuItem>
          <MenuItem value="Cestoball">Cestoball</MenuItem>
        </TextField>
      </Grid>

      {/* CATEGORÍA */}
      <Grid item xs={12} sm={4}>
        <TextField
          select
          label="Categoría"
          name="categoria"
          fullWidth
          size="small"
          value={socio.categoria}
          onChange={handleCategoriaChange}
          disabled={!socio.disciplina}
        >
          {socio.disciplina &&
            Object.keys(disciplinas[socio.disciplina]).map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
        </TextField>
      </Grid>

      {/* EQUIPO */}
      <Grid item xs={12} sm={4}>
        <TextField
          select
          label="Equipo"
          name="equipo"
          fullWidth
          size="small"
          value={socio.equipo}
          onChange={handleChange}
          disabled={!socio.categoria}
        >
          {socio.disciplina &&
            socio.categoria &&
            disciplinas[socio.disciplina][socio.categoria].map((eq) => (
              <MenuItem key={eq} value={eq}>
                {eq}
              </MenuItem>
            ))}
        </TextField>
      </Grid>

    </Grid>
  </Box>
</Box>

        {/* 3. CONTACTO */}
        <Box sx={sectionStyle}>
          <Box sx={sectionHeader}>3) CONTACTO</Box>
          <Box sx={sectionBody}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField label="Teléfono" name="telefono" fullWidth size="small" value={socio.telefono} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Email" name="email" fullWidth size="small" value={socio.email} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Dirección / Barrio" name="direccion" fullWidth size="small" value={socio.direccion} onChange={handleChange} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* 4. TUTOR */}
        <Box sx={sectionStyle}>
          <Box sx={sectionHeader}>4) TUTOR / RESPONSABLE</Box>
          <Box sx={sectionBody}>
            <FormControlLabel
              control={<Checkbox checked={socio.tiene_tutor} onChange={handleChange} name="tiene_tutor" />}
              label="Es menor / tiene tutor"
            />

            {socio.tiene_tutor && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Apellido y nombre tutor" name="tutor_nombre" fullWidth size="small"
                    value={socio.tutor_nombre} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField label="DNI tutor" name="tutor_dni" fullWidth size="small"
                    value={socio.tutor_dni} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField label="Vínculo" name="vinculo" fullWidth size="small"
                    value={socio.vinculo} onChange={handleChange} />
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
{/* 5. SALUD Y APTO MÉDICO */}
<Box sx={sectionStyle}>
  <Box sx={sectionHeader}>5) SALUD Y APTO MÉDICO</Box>
  <Box sx={sectionBody}>
    <Grid container spacing={2}>

      <Grid item xs={12} sm={4}>
        <TextField
          select
          label="¿Presenta apto médico?"
          name="apto_medico"
          fullWidth
          size="small"
          value={socio.apto_medico}
          onChange={handleChange}
        >
          <MenuItem value="Si">Sí</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          type="date"
          label="Vencimiento apto médico"
          name="venc_apto"
          InputLabelProps={{ shrink: true }}
          fullWidth
          size="small"
          value={socio.venc_apto}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          label="Obra social / Prepaga"
          name="obra_social"
          fullWidth
          size="small"
          value={socio.obra_social}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          label="Teléfono de emergencia"
          name="tel_emergencia"
          fullWidth
          size="small"
          value={socio.tel_emergencia}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Observaciones médicas"
          name="obs_medicas"
          fullWidth
          size="small"
          multiline
          rows={2}
          value={socio.obs_medicas}
          onChange={handleChange}
        />
      </Grid>

    </Grid>
  </Box>
</Box>
{/* 7. CONSENTIMIENTOS */}
<Box sx={sectionStyle}>
  <Box sx={sectionHeader}>7) CONSENTIMIENTOS</Box>
  <Box sx={sectionBody}>
    <Grid container spacing={2}>

      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Autorización uso de imagen"
          name="autorizacion_imagen"
          fullWidth
          size="small"
          value={socio.autorizacion_imagen}
          onChange={handleChange}
        >
          <MenuItem value="Si">Sí</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Autorización salidas / viajes"
          name="autorizacion_viajes"
          fullWidth
          size="small"
          value={socio.autorizacion_viajes}
          onChange={handleChange}
        >
          <MenuItem value="Si">Sí</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

    </Grid>
  </Box>
</Box>
{/* 8. CONTROL INTERNO */}
<Box sx={sectionStyle}>
  <Box sx={sectionHeader}>8) CONTROL INTERNO</Box>
  <Box sx={sectionBody}>
    <Grid container spacing={2}>

      <Grid item xs={12} sm={4}>
        <TextField
          label="Profesor/a que carga"
          name="profesor_carga"
          fullWidth
          size="small"
          value={socio.profesor_carga}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          type="date"
          label="Fecha de inscripción"
          name="fecha_inscripcion"
          InputLabelProps={{ shrink: true }}
          fullWidth
          size="small"
          value={socio.fecha_inscripcion}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Observaciones internas"
          name="obs_internas"
          fullWidth
          size="small"
          multiline
          rows={2}
          value={socio.obs_internas}
          onChange={handleChange}
        />
      </Grid>

    </Grid>
  </Box>
</Box>

        {/* BOTONES */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>Cancelar</Button>
        </Box>

      </CardContent>
    </Card>
  );
};

export default SocioNuevo;
