import React, { useRef } from "react";
import quilmes from "../../assets/quilmes.jpeg"; 
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "./index1.css";

const HeroSection = () => {
  const navigate = useNavigate();
  const shieldRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = shieldRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;

    const rotateMax = 10;
    const translateMax = 8;

    const rotateX = -dy * rotateMax;
    const rotateY = dx * rotateMax;
    const translateX = dx * translateMax;
    const translateY = dy * translateMax;

    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0)`;
  };

  const handleMouseLeave = () => {
    const el = shieldRef.current;
    if (!el) return;
    el.style.transform = "";
  };

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>
          Simos <span className="highlight">Club Atlético Quilmes</span>
        </h1>
        <p>#40Años</p>
        <Button
          variant="contained"
          onClick={() => navigate("/principal/")}
          className="btn"
        >
          Ingresar
        </Button>
      </div>

      <div
        className="hero-image"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="shield-scene">
          <div className="shield-ring ring-1" />
          <div className="shield-ring ring-2" />
          <div className="shield-glow" />
          <div className="shield-container" ref={shieldRef}>
            <img src={quilmes} alt="Escudo Quilmes" className="shield-img" />
            <div className="shield-shine" />
            <div className="shield-badge">40 AÑOS</div>
          </div>
          <div className="particles" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
