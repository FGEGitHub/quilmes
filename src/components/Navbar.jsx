
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link, useNavigate } from "react-router-dom";
import { usePanelTheme } from "./usuariologeado/MenuClub";

import logo from "../assets/nuevo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

  // HEREDAR TEMA DEL MENU CLUB
  const panelTheme = usePanelTheme();

  const colors = panelTheme?.colors || {
    sidebar: "#ffffff",
    text: "#172033",
    secondary: "#64748b",
    border: "#e2e8f0",
    active: "#e8eefc",
    primary: "#3155c9",
  };

  const loggedUserJSON = window.localStorage.getItem(
    "loggedNoteAppUser"
  );

  let userContext = null;

  if (loggedUserJSON) {
    try {
      userContext = JSON.parse(loggedUserJSON);
    } catch (error) {
      window.localStorage.removeItem("loggedNoteAppUser");
    }
  }

  const isLogueado = !!userContext?.token;
  const isNivel1 = String(userContext?.nivel) === "1";
  const isNivel2 = String(userContext?.nivel) === "2";

  // CERRAR MENU AL CAMBIAR DE PANTALLA
  const cerrarMenu = () => setIsOpen(false);

  // CERRAR SESION
  const handleLogout = () => {
    window.localStorage.removeItem("loggedNoteAppUser");
    setIsOpen(false);
    navigate("/");
  };

  // ==============================
  // LINKS
  // ==============================

  const links = [
    {
      nombre: "Login",
      path: "/login",
      mostrar: true,
    },
    {
      nombre: "Cuotas",
      path: "/usuario/cuotas",
      mostrar: isLogueado && isNivel2,
    },
    {
      nombre: "Socios",
      path: "/usuario/socios",
      mostrar: isLogueado && (isNivel1 || isNivel2),
    },
    {
      nombre: "Carga Actividades",
      path: "/usuario/cargaract",
      mostrar: isLogueado && isNivel2,
    },
    {
      nombre: "Dashboard Actividades",
      path: "/usuario/dashboard",
      mostrar: isLogueado && isNivel2,
    },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1500,
        bgcolor: colors.sidebar,
        color: colors.text,
        borderBottom: `1px solid ${colors.border}`,
        transition: "background-color 0.25s ease",
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: "64px !important",
            md: "76px !important",
          },
          px: {
            xs: 2,
            md: 4,
          },
          display: "flex",
          justifyContent: "space-between",
        }}
      >

        {/* LOGO */}

        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            minWidth: 0,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo Quilmes"
            sx={{
              width: {
                xs: 40,
                md: 50,
              },
              height: {
                xs: 40,
                md: 50,
              },
              objectFit: "contain",
            }}
          />

          <Typography
            sx={{
              fontSize: {
                xs: 15,
                sm: 18,
                md: 21,
              },
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: colors.text,
              whiteSpace: "nowrap",
            }}
          >
            Club Atlético Quilmes
          </Typography>
        </Box>

        {/* MENU DESKTOP */}

        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {links
              .filter((item) => item.mostrar)
              .map((item) => (
                <Button
                  key={item.nombre}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: colors.secondary,
                    fontWeight: 600,
                    fontSize: 13,
                    textTransform: "none",
                    borderRadius: "10px",
                    px: 2,
                    py: 1,

                    "&:hover": {
                      bgcolor: colors.active,
                      color: colors.primary,
                    },
                  }}
                >
                  {item.nombre}
                </Button>
              ))}

            {isLogueado && (
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  ml: 1,
                  color: "#dc5555",
                  fontWeight: 650,
                  textTransform: "none",
                  borderRadius: "10px",
                  px: 2,

                  "&:hover": {
                    bgcolor: isDarkMode(panelTheme)
                      ? "#3b2028"
                      : "#fff0f0",
                  },
                }}
              >
                Cerrar sesión
              </Button>
            )}
          </Box>
        )}

        {/* BOTON MOBILE */}

        {isMobile && (
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: "10px",
            }}
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Toolbar>

      {/* MENU MOBILE */}

      {isMobile && (
        <Box
          sx={{
            display: isOpen ? "flex" : "none",
            flexDirection: "column",
            bgcolor: colors.sidebar,
            borderTop: `1px solid ${colors.border}`,
            px: 2,
            py: 1.5,
            gap: 0.5,
          }}
        >
          {links
            .filter((item) => item.mostrar)
            .map((item) => (
              <Button
                key={item.nombre}
                component={Link}
                to={item.path}
                onClick={cerrarMenu}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  color: colors.text,
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "10px",
                  px: 2,
                  py: 1.3,

                  "&:hover": {
                    bgcolor: colors.active,
                    color: colors.primary,
                  },
                }}
              >
                {item.nombre}
              </Button>
            ))}

          {isLogueado && (
            <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              fullWidth
              sx={{
                justifyContent: "flex-start",
                color: "#dc5555",
                textTransform: "none",
                fontWeight: 650,
                px: 2,
                py: 1.3,
                borderRadius: "10px",
              }}
            >
              Cerrar sesión
            </Button>
          )}
        </Box>
      )}
    </AppBar>
  );
};

// Helper
const isDarkMode = (theme) => theme?.isDark || false;

export default Navbar;
