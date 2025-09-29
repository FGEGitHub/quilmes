import React from "react";
import "./Hero.css";
import profile from "../../assets/quilmes.jpeg";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Bienvenidos a <span className="highlight">Club Atlético Quilmes</span></h1>
        <p>Pasión, historia y 40 años de deporte.</p>
      </div>
      <div className="hero-image">
        <img src={profile} alt="Escudo Club Quilmes" />
      </div>
    </section>
  );
};

export default Hero;
