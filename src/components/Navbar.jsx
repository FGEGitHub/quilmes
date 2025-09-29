import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Club Atlético Quilmes</div>
      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
            <li><Link to="/calendario">Calendario</Link></li>
        <li className="dropdown">
          <span>Deportes ▾</span>
          <ul className="dropdown-menu">
            <li><Link to="/deportes/futbol-masculino">Fútbol Masculino</Link></li>
            <li><Link to="/deportes/futbol-femenino">Fútbol Femenino</Link></li>
            <li><Link to="/deportes/basquet">Básquet</Link></li>
            <li><Link to="/deportes/hockey">Hockey</Link></li>
          </ul>
        </li>
        <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
