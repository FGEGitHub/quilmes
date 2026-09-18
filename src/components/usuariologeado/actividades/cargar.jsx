import React, { useEffect, useState } from "react";

const API = "http://localhost:3000/api";

const meses = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

export default function RegistroGastos() {

  // =====================================================
  // USUARIO
  // =====================================================

  const [usuarioId, setUsuarioId] = useState(
    localStorage.getItem("usuarioId") || ""
  );

  const [nombreUsuario, setNombreUsuario] = useState(
    localStorage.getItem("nombreUsuario") || ""
  );

  // =====================================================
  // DATOS DE LOS DESPLEGABLES
  // =====================================================

  const [actividades, setActividades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [zonas, setZonas] = useState([]);

  // =====================================================
  // FORMULARIO
  // =====================================================

  const [form, setForm] = useState({
    actividad_id: "",
    tipo_id: "",
    descripcion: "",
    zona_id: "",
    monto: "",
    fecha: "",
  });

  // =====================================================
  // FILTROS
  // =====================================================

  const [filtros, setFiltros] = useState({
    actividad_id: "",
    mes: "",
    tipo_id: "",
    zona_id: "",
  });

  // =====================================================
  // ESTADOS
  // =====================================================

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  // =====================================================
  // CARGAR DATOS
  // =====================================================

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {

    try {

      const [
        actividadesResponse,
        tiposResponse,
        zonasResponse
      ] = await Promise.all([

        fetch(`${API}/actividades`),
        fetch(`${API}/tipos-actividad`),
        fetch(`${API}/zonas`)

      ]);

      if (!actividadesResponse.ok) {
        throw new Error("Error cargando actividades");
      }

      if (!tiposResponse.ok) {
        throw new Error("Error cargando tipos");
      }

      if (!zonasResponse.ok) {
        throw new Error("Error cargando zonas");
      }

      const actividadesData = await actividadesResponse.json();
      const tiposData = await tiposResponse.json();
      const zonasData = await zonasResponse.json();

      setActividades(actividadesData);
      setTipos(tiposData);
      setZonas(zonasData);

    } catch (error) {

      console.error(error);

      mostrarMensaje(
        "No se pudieron cargar los datos.",
        "error"
      );

    }

  };

  // =====================================================
  // MENSAJE
  // =====================================================

  const mostrarMensaje = (texto, tipo = "success") => {

    setMensaje(texto);
    setTipoMensaje(tipo);

    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 3500);

  };

  // =====================================================
  // CAMBIOS DEL FORMULARIO
  // =====================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  // =====================================================
  // CAMBIAR ACTIVIDAD
  // =====================================================

  const cambiarActividad = (e) => {

    const actividadId = e.target.value;

    const actividad = actividades.find(
      (item) => String(item.id) === String(actividadId)
    );

    setForm((prev) => ({
      ...prev,
      actividad_id: actividadId,
      tipo_id: actividad?.tipo_id || "",
    }));

  };

  // =====================================================
  // AGREGAR GASTO
  // =====================================================

  const agregarGasto = async () => {

    // IMPORTANTE:
    // Sacamos nuevamente el usuarioId del localStorage
    // justo antes de enviar.

    const usuarioIdActual = localStorage.getItem("usuarioId");

    if (!usuarioIdActual) {

      mostrarMensaje(
        "No se encontró el usuario. Volvé a iniciar sesión.",
        "error"
      );

      return;
    }

    // Validaciones

    if (!form.actividad_id) {
      mostrarMensaje(
        "Seleccioná una actividad.",
        "error"
      );
      return;
    }

    if (!form.tipo_id) {
      mostrarMensaje(
        "Seleccioná un tipo de actividad.",
        "error"
      );
      return;
    }

    if (!form.descripcion.trim()) {
      mostrarMensaje(
        "Ingresá una descripción.",
        "error"
      );
      return;
    }

    if (!form.zona_id) {
      mostrarMensaje(
        "Seleccioná una zona.",
        "error"
      );
      return;
    }

    if (!form.monto || Number(form.monto) <= 0) {
      mostrarMensaje(
        "Ingresá un monto válido.",
        "error"
      );
      return;
    }

    if (!form.fecha) {
      mostrarMensaje(
        "Seleccioná una fecha.",
        "error"
      );
      return;
    }

    try {

      setCargando(true);

      // =================================================
      // ESTO ES LO QUE RECIBE EL BACKEND
      // =================================================

      const datosGasto = {

        usuario_id: Number(usuarioIdActual),

        actividad_id: Number(form.actividad_id),

        zona_id: Number(form.zona_id),

        descripcion: form.descripcion.trim(),

        monto: Number(form.monto),

        fecha: form.fecha,

      };

      console.log("Enviando gasto:", datosGasto);

      const response = await fetch(`${API}/gastos`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(datosGasto),

      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Error al guardar el gasto"
        );
      }

      mostrarMensaje(
        "Gasto agregado correctamente.",
        "success"
      );

      // Limpiar formulario

      setForm({
        actividad_id: "",
        tipo_id: "",
        descripcion: "",
        zona_id: "",
        monto: "",
        fecha: "",
      });

    } catch (error) {

      console.error(error);

      mostrarMensaje(
        error.message || "No se pudo guardar el gasto.",
        "error"
      );

    } finally {

      setCargando(false);

    }

  };

  // =====================================================
  // FILTROS
  // =====================================================

  const cambiarFiltro = (e) => {

    const { name, value } = e.target;

    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  // =====================================================
  // RENDER
  // =====================================================

  return (

    <>

      <style>{`

        * {
          box-sizing: border-box;
        }

        .gastos-container {
          width: 90%;
          max-width: 1000px;
          margin: 35px auto;
          color: #173b5c;
          font-family: Arial, Helvetica, sans-serif;
        }

        /* ===============================
           TITULO
        =============================== */

        .titulo h1 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 36px;
          color: #173b5c;
        }

        .titulo p {
          margin-top: 6px;
          font-size: 17px;
          color: #31506d;
        }

        /* ===============================
           USUARIO
        =============================== */

        .usuario-card {
          margin-top: 25px;
          padding: 18px 22px;
          background: #fff;
          border: 1px solid #ddcfbd;
          border-radius: 13px;

          display: flex;
          align-items: center;
          gap: 15px;
        }

        .usuario-label {
          font-weight: bold;
          white-space: nowrap;
        }

        .usuario-input {
          width: 275px;
          height: 47px;
          padding: 0 14px;
          border: 1px solid #ddcfbd;
          border-radius: 8px;
          font-size: 16px;
          color: #24415d;
          background: #fffdfa;
        }

        .usuario-input:focus,
        .campo-input:focus,
        .campo-select:focus {
          outline: none;
          border-color: #31766b;
          box-shadow: 0 0 0 2px rgba(49, 118, 107, .10);
        }

        .usuario-info {
          color: #166b6a;
          font-weight: bold;
          font-size: 15px;
        }

        /* ===============================
           CARD GASTO
        =============================== */

        .gasto-card {
          margin-top: 27px;
          padding: 27px;
          background: #fff;
          border: 1px solid #ddcfbd;
          border-left: 6px solid #31766b;
          border-radius: 13px;
        }

        .fila {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .fila-tres {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
        }

        .campo {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 17px;
        }

        .campo-label {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: .3px;
          color: #315574;
        }

        .campo-input,
        .campo-select {
          width: 100%;
          height: 49px;
          border: 1px solid #ddcfbd;
          border-radius: 8px;
          padding: 0 14px;
          font-size: 16px;
          color: #24415d;
          background: #fffdfa;
        }

        .campo-input::placeholder {
          color: #7c8994;
        }

        /* ===============================
           BOTON AGREGAR
        =============================== */

        .boton-container {
          display: flex;
          justify-content: flex-end;
          margin-top: -2px;
        }

        .btn-agregar {
          height: 48px;
          padding: 0 21px;
          border: none;
          border-radius: 8px;
          background: #91b4af;
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: .2s;
        }

        .btn-agregar:hover {
          background: #729e98;
        }

        .btn-agregar:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        /* ===============================
           FILTROS
        =============================== */

        .filtros {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.6fr 1fr;
          gap: 13px;
          margin-top: 35px;
        }

        .filtro-select {
          width: 100%;
          height: 49px;
          padding: 0 14px;
          border: 1px solid #ddcfbd;
          border-radius: 8px;
          background: #fff;
          color: #24415d;
          font-size: 16px;
        }

        .filtro-select:focus {
          outline: none;
          border-color: #31766b;
        }

        /* ===============================
           ACCIONES
        =============================== */

        .acciones {
          display: flex;
          gap: 10px;
          margin-top: 13px;
        }

        .btn-accion {
          height: 47px;
          padding: 0 20px;
          border: 1px solid #ddcfbd;
          border-radius: 8px;
          background: white;
          color: #173b5c;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .btn-rendicion {
          background: #f5e3cc;
          color: #8a551d;
        }

        .btn-accion:hover {
          opacity: .85;
        }

        /* ===============================
           MENSAJE
        =============================== */

        .mensaje {
          margin-top: 18px;
          padding: 12px 15px;
          border-radius: 8px;
          font-weight: bold;
          background: white;
          border: 1px solid #ddd;
        }

        .mensaje-success {
          color: #166b6a;
          border-color: #a7ccc6;
          background: #f1faf8;
        }

        .mensaje-error {
          color: #a33b3b;
          border-color: #e3b5b5;
          background: #fff5f5;
        }

        /* ===============================
           MOBILE
        =============================== */

        @media (max-width: 768px) {

          .gastos-container {
            width: 94%;
            margin: 25px auto;
          }

          .titulo h1 {
            font-size: 29px;
          }

          .usuario-card {
            flex-direction: column;
            align-items: stretch;
          }

          .usuario-input {
            width: 100%;
          }

          .fila,
          .fila-tres {
            grid-template-columns: 1fr;
          }

          .filtros {
            grid-template-columns: 1fr;
          }

          .acciones {
            flex-direction: column;
          }

          .btn-accion {
            width: 100%;
          }

          .boton-container {
            justify-content: stretch;
          }

          .btn-agregar {
            width: 100%;
          }

        }

      `}</style>


      <div className="gastos-container">

        {/* =========================================
            TITULO
        ========================================= */}

        <div className="titulo">

          <h1>
            Registro de gastos
          </h1>

          <p>
            Cargar gastos por actividad.
          </p>

        </div>


        {/* =========================================
            USUARIO
        ========================================= */}

        <div className="usuario-card">

          <label className="usuario-label">
            Tu nombre
          </label>

          <input
            className="usuario-input"
            type="text"
            placeholder="Ej: Juan Pérez"
            value={nombreUsuario}
            onChange={(e) => {

              setNombreUsuario(e.target.value);

              localStorage.setItem(
                "nombreUsuario",
                e.target.value
              );

            }}
          />

          <span className="usuario-info">

            {usuarioId
              ? "Usuario identificado. Ya podés cargar gastos."
              : "No se encontró usuarioId en localStorage."
            }

          </span>

        </div>


        {/* =========================================
            FORMULARIO
        ========================================= */}

        <div className="gasto-card">

          {/* ACTIVIDAD + TIPO */}

          <div className="fila">

            <div className="campo">

              <label className="campo-label">
                NOMBRE DE LA ACTIVIDAD
              </label>

              <select
                className="campo-select"
                name="actividad_id"
                value={form.actividad_id}
                onChange={cambiarActividad}
              >

                <option value="">
                  Elegir actividad
                </option>

                {actividades.map((actividad) => (

                  <option
                    key={actividad.id}
                    value={actividad.id}
                  >
                    {actividad.nombre}
                  </option>

                ))}

              </select>

            </div>


            <div className="campo">

              <label className="campo-label">
                TIPO DE ACTIVIDAD
              </label>

              <select
                className="campo-select"
                name="tipo_id"
                value={form.tipo_id}
                onChange={handleChange}
              >

                <option value="">
                  Elegir tipo
                </option>

                {tipos.map((tipo) => (

                  <option
                    key={tipo.id}
                    value={tipo.id}
                  >
                    {tipo.nombre}
                  </option>

                ))}

              </select>

            </div>

          </div>


          {/* DESCRIPCION */}

          <div className="campo">

            <label className="campo-label">
              DESCRIPCIÓN
            </label>

            <input
              className="campo-input"
              type="text"
              name="descripcion"
              placeholder="Ej: Combustible"
              value={form.descripcion}
              onChange={handleChange}
            />

          </div>


          {/* ZONA + MONTO + FECHA */}

          <div className="fila-tres">

            <div className="campo">

              <label className="campo-label">
                ZONA
              </label>

              <select
                className="campo-select"
                name="zona_id"
                value={form.zona_id}
                onChange={handleChange}
              >

                <option value="">
                  Elegir zona
                </option>

                {zonas.map((zona) => (

                  <option
                    key={zona.id}
                    value={zona.id}
                  >
                    {zona.nombre}
                  </option>

                ))}

              </select>

            </div>


            <div className="campo">

              <label className="campo-label">
                MONTO
              </label>

              <input
                className="campo-input"
                type="number"
                name="monto"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.monto}
                onChange={handleChange}
              />

            </div>


            <div className="campo">

              <label className="campo-label">
                FECHA
              </label>

              <input
                className="campo-input"
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* BOTON */}

          <div className="boton-container">

            <button
              className="btn-agregar"
              onClick={agregarGasto}
              disabled={cargando || !usuarioId}
            >

              {cargando
                ? "Guardando..."
                : "Agregar gasto"
              }

            </button>

          </div>

        </div>


        {/* =========================================
            FILTROS
        ========================================= */}

        <div className="filtros">

          {/* ACTIVIDAD */}

          <select
            className="filtro-select"
            name="actividad_id"
            value={filtros.actividad_id}
            onChange={cambiarFiltro}
          >

            <option value="">
              Todas las actividades
            </option>

            {actividades.map((actividad) => (

              <option
                key={actividad.id}
                value={actividad.id}
              >
                {actividad.nombre}
              </option>

            ))}

          </select>


          {/* MES */}

          <select
            className="filtro-select"
            name="mes"
            value={filtros.mes}
            onChange={cambiarFiltro}
          >

            <option value="">
              Todos los meses
            </option>

            {meses.map((mes) => (

              <option
                key={mes.value}
                value={mes.value}
              >
                {mes.label}
              </option>

            ))}

          </select>


          {/* TIPO */}

          <select
            className="filtro-select"
            name="tipo_id"
            value={filtros.tipo_id}
            onChange={cambiarFiltro}
          >

            <option value="">
              Todos los tipos
            </option>

            {tipos.map((tipo) => (

              <option
                key={tipo.id}
                value={tipo.id}
              >
                {tipo.nombre}
              </option>

            ))}

          </select>


          {/* ZONA */}

          <select
            className="filtro-select"
            name="zona_id"
            value={filtros.zona_id}
            onChange={cambiarFiltro}
          >

            <option value="">
              Todas las zonas
            </option>

            {zonas.map((zona) => (

              <option
                key={zona.id}
                value={zona.id}
              >
                {zona.nombre}
              </option>

            ))}

          </select>

        </div>


        {/* =========================================
            ACCIONES
        ========================================= */}

        <div className="acciones">

          <button className="btn-accion btn-rendicion">
            Ver todo (rendición)
          </button>

          <button className="btn-accion">
            Exportar Excel
          </button>

          <button className="btn-accion">
            Exportar CSV
          </button>

        </div>


        {/* =========================================
            MENSAJE
        ========================================= */}

        {mensaje && (

          <div
            className={`mensaje ${
              tipoMensaje === "error"
                ? "mensaje-error"
                : "mensaje-success"
            }`}
          >
            {mensaje}
          </div>

        )}

      </div>

    </>
  );
}