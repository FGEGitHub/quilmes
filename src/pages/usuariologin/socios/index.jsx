import React from "react";
import Componente from "../../../components/usuariologeado/socios/listadesocios";
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
      <Box sx={{ mt: isMobile ? 0 : "-20%" }}>
        <Componente />
      </Box>
      <Footer />
    </>
  );
};

export default HeroSection;
