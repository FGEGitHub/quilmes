import React, { useEffect, useState } from "react";
import "./Hero.css";
import profile from "../../assets/quilmes.jpeg";

const Hero = () => {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    import("../../data/noticias.json")
      .then((data) => {
        const noticiasOrdenadas = (data.default || data).sort((a, b) => {
          const fechaA = new Date(`${a.fecha} ${a.hora}`);
          const fechaB = new Date(`${b.fecha} ${b.hora}`);
          return fechaB - fechaA;
        });
        setNoticias(noticiasOrdenadas.slice(0, 4));
      })
      .catch((err) => console.error("Error cargando noticias:", err));
  }, []);

  return (
    <>
      {/* Hero principal */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Bienvenidos a <span className="highlight">Club Atlético Quilmes</span>
          </h1>
          <p>Pasión, historia y 40 años de deporte.</p>
        </div>
        <div className="hero-image">
          <img src={profile} alt="Escudo Club Quilmes" />
        </div>
      </section>

      {/* Noticias debajo */}
      <section className="noticias">
        <h2>📰 Últimas Noticias</h2>
        <div className="hero-noticias">
          {noticias.map((n, idx) => {
            let imagenSrc;
            try {
              imagenSrc = require(`../../assets/${n.imagen}`);
            } catch {
              imagenSrc = profile;
            }

            return (
              <div key={idx} className="noticia-card">
                <img src={imagenSrc} alt={n.titulo} className="noticia-img" />
                <div className="noticia-body">
                  <h3>{n.titulo}</h3>
                  <p>{n.contenido}</p>
                </div>
                <div className="noticia-footer">
                  <span>{n.pie}</span>
                  <span>
                    {n.fecha} • {n.hora}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Hero;
