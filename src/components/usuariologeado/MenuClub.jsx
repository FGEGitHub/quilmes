import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from "react";

import {
  Box,
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Switch,
} from "@mui/material";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import GroupIcon from "@mui/icons-material/Group";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StadiumIcon from "@mui/icons-material/Stadium";

import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Navbar";

// Contexto para compartir el tema con el Navbar
export const PanelThemeContext = createContext(null);

export const usePanelTheme = () => useContext(PanelThemeContext);

const drawerWidth = 280;

const MenuClub = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useMediaQuery("(max-width:900px)");

  const [menuOpen, setMenuOpen] = useState(false);

  // ==============================
  // TEMA CLARO / OSCURO
  // ==============================

  const [mode, setMode] = useState(
    () => localStorage.getItem("quilmes-theme") || "light"
  );

  const isDark = mode === "dark";

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    localStorage.setItem("quilmes-theme", mode);
  }, [mode]);

  const colors = {
    background: isDark ? "#0f172a" : "#f1f5f9",
    sidebar: isDark ? "#0f172a" : "#ffffff",
    active: isDark ? "#1e293b" : "#e8eefc",
    border: isDark ? "#1e293b" : "#e2e8f0",
    primary: "#3155c9",
    text: isDark ? "#f8fafc" : "#172033",
    secondary: isDark ? "#94a3b8" : "#64748b",
    muted: "#64748b",
  };

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#3155c9",
          },
          background: {
            default: colors.background,
            paper: colors.sidebar,
          },
          text: {
            primary: colors.text,
            secondary: colors.secondary,
          },
        },
        shape: {
          borderRadius: 10,
        },
      }),
    [mode]
  );

  // ==============================
  // OPCIONES DEL MENÚ LATERAL
  // ==============================

  const opciones = [
    {
      id: "inicio",
      nombre: "Inicio",
      icono: <HomeIcon />,
      path: "/usuario/inicio",
    },
    {
      id: "actividadesparametros",
      nombre: "Actividades Parámetros",
      icono: <SettingsIcon />,
      path: "/usuario/actividadesparametros",
    },
    {
      id: "cargaractividad",
      nombre: "Cargar actividad",
      icono: <SportsSoccerIcon />,
      path: "/usuario/cargaract",
    },
    {
      id: "jugadores",
      nombre: "Jugadores",
      icono: <SportsSoccerIcon />,
      path: "/usuario/socios",
    },
    {
      id: "socios",
      nombre: "Socios",
      icono: <GroupIcon />,
      path: "/usuario/socios",
    },
    {
      id: "cobros",
      nombre: "Cobros",
      icono: <CreditCardIcon />,
      path: "/usuario/cobros",
    },
    {
      id: "indumentaria",
      nombre: "Indumentaria",
      icono: <CheckroomIcon />,
      path: "/usuario/indumentaria",
    },
    {
      id: "caja",
      nombre: "Caja",
      icono: <AccountBalanceWalletIcon />,
      path: "/usuario/caja",
    },
    {
      id: "partidos",
      nombre: "Partidos",
      icono: <StadiumIcon />,
      path: "/usuario/partidos",
    },
  ];

  // ==============================
  // NAVEGACIÓN
  // ==============================

  const handleClick = (item) => {
    navigate(item.path);

    if (isMobile) {
      setMenuOpen(false);
    }
  };

  const esActivo = (path) => {
    if (!path) return false;

    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );
  };

  // ==============================
  // CONTENIDO DEL DRAWER
  // ==============================

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: colors.sidebar,
        color: colors.text,
      }}
    >
      {/* LOGO */}

      <Box
        sx={{
          height: 70,
          minHeight: 70,
          display: "flex",
          alignItems: "center",
          px: 2.5,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <SportsSoccerIcon
          sx={{
            color: colors.primary,
            fontSize: 32,
            mr: 1.2,
          }}
        />

        <Box>
          <Typography
            sx={{
              fontSize: 23,
              fontWeight: 850,
              letterSpacing: "-0.5px",
              color: colors.text,
              lineHeight: 1.1,
            }}
          >
            QUILMES
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "1.5px",
              color: colors.secondary,
            }}
          >
            GESTIÓN DEL CLUB
          </Typography>
        </Box>
      </Box>

      {/* IDENTIDAD DEL CLUB */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2.7,
          py: 3,
          gap: 2,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: "16px",
            bgcolor: "#3155c9",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <SportsSoccerIcon sx={{ fontSize: 32 }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: colors.text,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Club Quilmes
          </Typography>

          <Typography
            sx={{
              color: colors.secondary,
              fontSize: 13,
            }}
          >
            Panel de administración
          </Typography>

          <Typography
            sx={{
              color: "#4263d6",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Sistema de gestión
          </Typography>
        </Box>
      </Box>

      {/* MENÚ PRINCIPAL */}

      <Box sx={{ pt: 3 }}>
        <Typography
          sx={{
            px: 2.7,
            mb: 1.5,
            fontSize: 12,
            fontWeight: 800,
            color: colors.muted,
            letterSpacing: "0.8px",
          }}
        >
          MENÚ PRINCIPAL
        </Typography>

        <List sx={{ p: 0 }}>
          {opciones.map((item) => {
            const active = esActivo(item.path);

            return (
              <ListItemButton
                key={item.id}
                onClick={() => handleClick(item)}
                sx={{
                  minHeight: 56,
                  px: 2.7,
                  borderRadius: 0,
                  bgcolor: active ? colors.active : "transparent",
                  borderRight: active
                    ? `4px solid ${colors.primary}`
                    : "4px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: colors.active,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 48,
                    color: active ? colors.primary : "#8b5cf6",
                    "& svg": {
                      fontSize: 22,
                    },
                  }}
                >
                  {item.icono}
                </ListItemIcon>

                <ListItemText
                  primary={item.nombre}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: active ? colors.text : colors.secondary,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* ESPACIO FLEXIBLE */}

      <Box sx={{ flexGrow: 1, minHeight: 30 }} />

      {/* CAMBIAR TEMA */}

      <Divider sx={{ borderColor: colors.border }} />

      <List sx={{ py: 0.5 }}>
        <ListItemButton
          onClick={toggleTheme}
          sx={{
            minHeight: 60,
            px: 2.7,
            "&:hover": {
              bgcolor: colors.active,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 48 }}>
            {isDark ? (
              <LightModeIcon sx={{ color: "#eab308" }} />
            ) : (
              <DarkModeIcon sx={{ color: "#6366f1" }} />
            )}
          </ListItemIcon>

          <ListItemText
            primary={isDark ? "Modo claro" : "Modo oscuro"}
            primaryTypographyProps={{
              fontSize: 14,
              color: colors.text,
            }}
          />

          <Switch
            checked={isDark}
            onChange={toggleTheme}
            onClick={(e) => e.stopPropagation()}
            size="small"
            color="primary"
          />
        </ListItemButton>
      </List>
    </Box>
  );

  // ==============================
  // RENDER
  // ==============================

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <PanelThemeContext.Provider
        value={{
          mode,
          isDark,
          colors,
          toggleTheme,
        }}
      >
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            width: "100%",
            bgcolor: colors.background,
            color: colors.text,
          }}
        >
          {/* NAVBAR SUPERIOR */}

          <Navbar onOpenSidebar={() => setMenuOpen(true)} />

          {/* MENÚ LATERAL */}

          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? menuOpen : true}
            onClose={() => setMenuOpen(false)}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              width: isMobile ? undefined : drawerWidth,
              flexShrink: 0,

              "& .MuiDrawer-paper": {
                width: isMobile
                  ? `min(${drawerWidth}px, calc(100vw - 48px))`
                  : drawerWidth,

                boxSizing: "border-box",
                bgcolor: colors.sidebar,
                color: colors.text,
                borderRight: `1px solid ${colors.border}`,
                overflowX: "hidden",

                position: "fixed",
                top: isMobile ? "64px" : "76px",
                height: isMobile
                  ? "calc(100% - 64px)"
                  : "calc(100% - 76px)",
              },
            }}
          >
            {drawerContent}
          </Drawer>

          {/* CONTENIDO PRINCIPAL */}

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minWidth: 0,
              width: isMobile
                ? "100%"
                : `calc(100% - ${drawerWidth}px)`,
              minHeight: "100vh",
              bgcolor: colors.background,
              color: colors.text,

              // Espacio para el Navbar fijo
              pt: {
                xs: "80px",
                md: "100px",
              },

              px: {
                xs: 1.5,
                sm: 2.5,
                md: 3,
              },

              pb: {
                xs: 2,
                md: 3,
              },

              transition: "background-color 0.25s ease",
            }}
          >
            {children}
          </Box>
        </Box>
      </PanelThemeContext.Provider>
    </ThemeProvider>
  );
};

export default MenuClub;