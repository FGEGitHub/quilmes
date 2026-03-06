import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/nuevo.jpeg"; // ajustá la ruta si hace falta

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  let userContext = null;

  const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");

  if (loggedUserJSON) {
   
    try {
      userContext = JSON.parse(loggedUserJSON);
    } catch (error) {
      window.localStorage.removeItem("loggedNoteAppUser");
    }
  }

  const isLogueado = !!userContext?.token;
  const isNivel1 = userContext?.nivel == "1";
  const isNivel2 = userContext?.nivel == "2";

  const handleLogout = () => {
    window.localStorage.removeItem("loggedNoteAppUser");
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
  <div className="logo">
  <img src={logo} alt="Logo Quilmes"  style={{ width: "50px", display: "flex", alignItems: "center", gap: "10px" }}/>
  <span>Club Atlético Quilmes</span>
</div>


      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
                <li><Link to="/login" onClick={() => setIsOpen(false)}>Login</Link></li>

      

      {/*   <li><Link to="/calendario" onClick={() => setIsOpen(false)}>Calendario</Link></li>

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
 */}
        {/* 🔐 SOLO si está logueado y nivel 1 */}
          {isLogueado && isNivel2 && (
          <>
            <li>
              <Link to="/usuario/cuotas" onClick={() => setIsOpen(false)}>
                Cuotas
              </Link>
            </li>
               <li>
              <Link to="/usuario/socios" onClick={() => setIsOpen(false)}>
                Socios
              </Link>
            </li>
              <li>
              <button className="logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </li>
          </>
        )}
        {isLogueado && isNivel1 && (
          <>
        
            <li>
              <Link to="/usuario/socios" onClick={() => setIsOpen(false)}>
                Socios
              </Link>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
