import React from "react";
import Componente from "../../../components/usuariologeado/socios/nuevosocio";
import Nav from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Nav />
      <Box sx={{ mt: isMobile ? 0 : "-0%" }}>
        <Componente />
      </Box>
      <Footer />
    </>
  );
};

export default HeroSection;
