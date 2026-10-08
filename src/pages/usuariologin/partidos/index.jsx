import React from "react";
import Componente from "../../../components/usuariologeado/indumentaria/componente";
import Nav from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Izq from "../../../components/usuariologeado/MenuClub";
const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Nav />
      <Box sx={{ mt: isMobile ? 0 : "1%" }}>
          <Izq>
        <Componente /></Izq>
      </Box>
      <Footer />
    </>
  );
};

export default HeroSection;
