import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">Club Atlético Quilmes</div>

      {/* Botón Hamburguesa */}
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={() => setIsOpen(false)}>Inicio</Link></li>
        <li><Link to="/calendario" onClick={() => setIsOpen(false)}>Calendario</Link></li>
        <li className="dropdown">
          <span>Deportes ▾</span>
          <ul className="dropdown-menu">
            <li><Link to="/deportes/futbol-masculino" onClick={() => setIsOpen(false)}>Fútbol Masculino</Link></li>
            <li><Link to="/deportes/futbol-femenino" onClick={() => setIsOpen(false)}>Fútbol Femenino</Link></li>
            <li><Link to="/deportes/basquet" onClick={() => setIsOpen(false)}>Básquet</Link></li>
            <li><Link to="/deportes/hockey" onClick={() => setIsOpen(false)}>Hockey</Link></li>
          </ul>
        </li>
        <li><Link to="/quienes-somos" onClick={() => setIsOpen(false)}>Quiénes Somos</Link></li>
        <li><Link to="/contacto" onClick={() => setIsOpen(false)}>Contacto</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
