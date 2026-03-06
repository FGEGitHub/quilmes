import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginService from '../../services/login'
import {
  Button,
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Avatar,
  Link
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import 'antd/dist/antd.css'
import servicioUsuario from '../../services/usuarios'
import Checkbox from '@mui/material/Checkbox';
import Nav from '../../components/Navbar.jsx'
import marcas from '../../assets/nuevo.jpeg'


const Login = () => {

  const [usuario, setUsuario] = useState({
    usuario: "",
    password: "",
  });

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      switch (user.nivel) {
        case "1":
          navigate('/usuario/socios')
          break;
        case "2":
          navigate('/usuario/socios')
          break;
        default:
          break;
      }
    }
  }, [])

  const hanleLogout = () => {
    setUser(null)
    servicioUsuario.setToken(user.token)
    window.localStorage.removeItem('loggedNoteAppUser')
  }

  const loginSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {

      const user = await loginService.login({
        usuario: usuario.usuario,
        password: usuario.password
      })

      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )

      servicioUsuario.setToken(user.token)

      setUser(user)
      setLoading(false)

      switch (user.nivel) {
        case '1':
          navigate('/usuario/socios')
          window.location.reload(true);
          break;

        case '2':
          navigate('/usuario/socios')
          window.location.reload(true);
          break;
      }

    } catch (error) {
      console.error(error)
      alert('error credenciales')
      window.location.reload(true)
    }
  }

  const handleChange = (e) =>
    setUsuario({ ...usuario, [e.target.name]: e.target.value });


  const LoginReturn = () => (
    <Grid
      container
      component="main"
      sx={{
        height: '100vh',
        width: '100vw',
        background: '#002D57',
        justifyContent: 'center'
      }}
    >

      <Nav />

      {/* LOGO GRANDE SOLO EN PC */}
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          textAlign: 'center',
          background: '#002D57',
          color: 'white',
        }}
      >

        <Box
          component="img"
          src={marcas}
          alt="Logo"
          sx={{
            width: {
              md: 500,
              lg: 650
            },
            height: 'auto'
          }}
        />

      </Grid>


      {/* LOGIN */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#002D57'
        }}
      >

        <Box sx={{ width: '100%', mx: 4 }}>

          <Card elevation={8} sx={{ p: 4, backgroundColor: '#ffffff', borderRadius: 3 }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

              {/* LOGO SOLO EN MOBILE */}
              <Box
                component="img"
                src={marcas}
                alt="Logo"
                sx={{
                  display: { xs: 'block', md: 'none' },
                  width: 120,
                  mb: 2
                }}
              />

              {/* CANDADO SOLO EN PC */}
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: '#002d57',
                  display: { xs: 'none', md: 'flex' }
                }}
              >
                <LockOutlinedIcon />
              </Avatar>

              <Typography component="h1" variant="h5">
                BIENVENIDO
              </Typography>

              <Typography
                variant="body2"
                sx={{ mt: 1, mb: 3, textAlign: 'center' }}
              >
                Iniciar Sesión
              </Typography>

            </Box>


            <Box component="form" onSubmit={loginSubmit} noValidate>

              <TextField
                fullWidth
                margin="normal"
                label="Usuario"
                name="usuario"
                value={usuario.usuario}
                onChange={handleChange}
                variant="outlined"
              />

              <TextField
                fullWidth
                margin="normal"
                label="Contraseña"
                type="password"
                name="password"
                value={usuario.password}
                onChange={handleChange}
                variant="outlined"
              />

              <Link href="#" variant="body2"></Link>

              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Recordarme"
                sx={{ mt: 1 }}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: '#148D8D',
                  mt: 2,
                  mb: 2,
                  ml: 'auto',
                  display: 'block'
                }}
              >

                {loading ? (
                  <CircularProgress color="inherit" size={25} />
                ) : (
                  "Ingresar"
                )}

              </Button>

              <Grid container justifyContent="space-between">

                <Typography variant="body2">
                  ¿No estás registrado?
                </Typography>

              </Grid>

            </Box>

          </Card>

        </Box>

      </Grid>

    </Grid>
  )

  return (
    <>
      {LoginReturn()}
    </>
  )
}

export default Login;