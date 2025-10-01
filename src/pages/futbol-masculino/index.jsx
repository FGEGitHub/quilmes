import React from "react";

import Componente from "../../components/deportes/deporte";
import Nav from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
const HeroSection = () => {
    const navigate = useNavigate();
  return (
   <>
   <Nav/>
   <Componente/>
   <Footer/>
   </>
  );
};

export default HeroSection;
