import React from "react";
import "./index2.css";
import Componente from "../../components/inicio/componente";
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
