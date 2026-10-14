
import React, { useEffect, useState } from "react";
import servicio from "../../../services/socios";

export default function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  // =========================================
  // CARGAR ACTIVIDADES
  // =========================================

  const cargarActividades = async () => {
    try {
      setCargando(true);

      const data = await servicio.traeractividades();

      console.log("ACTIVIDADES:", data);

      // Por si el servicio devuelve directamente
      // un array o un objeto con la propiedad data.
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setActividades(lista);
    } catch (error) {
      console.error("Error al cargar actividades:", error);
      mostrarMensaje("No se pudieron cargar las actividades.", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarActividades();
  }, []);

  // =========================================
  // MENSAJES
  // =========================================

  const mostrarMensaje = (texto, tipo = "success") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  // =========================================
  // CAMBIOS DEL FORMULARIO
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // GUARDAR NUEVA ACTIVIDAD
  // =========================================

  const guardarActividad = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      mostrarMensaje("Ingresá el nombre de la actividad.", "error");
      return;
    }

    if (!form.tipo.trim()) {
      mostrarMensaje("Ingresá el tipo de actividad.", "error");
      return;
    }

    try {
      setGuardando(true);
      setMensaje("");

      const datos = {
        nombre: form.nombre.trim(),
        tipo: form.tipo.trim(),
      };

      console.log("NUEVA ACTIVIDAD:", datos);

      // Este método debe existir en services/socios.
      await servicio.agregaractividad(datos);

      mostrarMensaje("Actividad guardada correctamente.", "success");

      setForm({
        nombre: "",
        tipo: "",
      });

      setMostrarFormulario(false);

      // Actualizar la tabla con los datos del servidor.
      await cargarActividades();
    } catch (error) {
      console.error("Error al guardar actividad:", error);

      mostrarMensaje(
        error?.response?.data?.message ||
          error?.message ||
          "No se pudo guardar la actividad.",
        "error"
      );
    } finally {
      setGuardando(false);
    }
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .actividades-container {
          width: 90%;
          max-width: 1000px;
          margin: 35px auto;
          color: #173b5c;
          font-family: Arial, Helvetica, sans-serif;
        }

        .actividades-titulo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 25px;
        }

        .actividades-titulo h1 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 36px;
          color: #173b5c;
        }

        .actividades-titulo p {
          margin-top: 6px;
          font-size: 17px;
          color: #31506d;
        }

        .actividades-card {
          margin-top: 20px;
          padding: 25px;
          background: #fff;
          border: 1px solid #ddcfbd;
          border-left: 6px solid #31766b;
          border-radius: 13px;
        }

        .actividades-card h2 {
          margin: 0 0 20px;
          font-family: Georgia, serif;
          font-size: 24px;
          color: #173b5c;
        }

        .btn-nueva {
          min-height: 46px;
          padding: 0 22px;
          border: none;
          border-radius: 8px;
          background: #31766b;
          color: white;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          transition: background .2s;
        }

        .btn-nueva:hover {
          background: #245b53;
        }

        .btn-cancelar {
          min-height: 46px;
          padding: 0 20px;
          border: 1px solid #ddcfbd;
          border-radius: 8px;
          background: #fff;
          color: #173b5c;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
        }

        .actividades-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .actividad-campo {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .actividad-campo label {
          font-size: 14px;
          font-weight: bold;
          color: #315574;
        }

        .actividad-campo input,
        .actividad-campo select {
          width: 100%;
          height: 48px;
          padding: 0 14px;
          border: 1px solid #ddcfbd;
          border-radius: 8px;
          background: #fffdfa;
          color: #24415d;
          font-size: 16px;
        }

        .actividad-campo input:focus,
        .actividad-campo select:focus {
          outline: none;
          border-color: #31766b;
          box-shadow: 0 0 0 2px rgba(49, 118, 107, .10);
        }

        .actividad-acciones {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        .tabla-contenedor {
          width: 100%;
          overflow-x: auto;
        }

        .tabla-actividades {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .tabla-actividades th {
          padding: 15px 14px;
          background: #edf4f1;
          color: #173b5c;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: .4px;
          border-bottom: 2px solid #ddcfbd;
        }

        .tabla-actividades td {
          padding: 15px 14px;
          border-bottom: 1px solid #eee5da;
          color: #31506d;
          font-size: 15px;
        }

        .tabla-actividades tbody tr:hover {
          background: #fffdfa;
        }

        .actividad-id {
          font-weight: bold;
          color: #31766b !important;
        }

        .actividad-tipo {
          display: inline-block;
          padding: 6px 11px;
          border-radius: 20px;
          background: #edf4f1;
          color: #245b53;
          font-size: 13px;
          font-weight: bold;
        }

        .actividades-vacio {
          padding: 30px 15px;
          text-align: center;
          color: #718096;
        }

        .actividades-mensaje {
          margin: 18px 0;
          padding: 13px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-weight: bold;
        }

        .actividades-success {
          color: #166b6a;
          border-color: #a7ccc6;
          background: #f1faf8;
        }

        .actividades-error {
          color: #a33b3b;
          border-color: #e3b5b5;
          background: #fff5f5;
        }

        .actividades-contador {
          margin-top: 16px;
          color: #718096;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .actividades-container {
            width: 94%;
            margin: 25px auto;
          }

          .actividades-titulo h1 {
            font-size: 29px;
          }

          .actividades-card {
            padding: 18px;
          }

          .actividades-form-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .actividades-titulo .btn-nueva {
            width: 100%;
          }

          .actividad-acciones {
            flex-direction: column;
          }

          .actividad-acciones button {
            width: 100%;
          }

          .tabla-actividades th,
          .tabla-actividades td {
            padding: 12px 10px;
            white-space: nowrap;
          }
        }
      `}</style>

      <div className="actividades-container">
        {/* ENCABEZADO */}
        <div className="actividades-titulo">
          <div>
            <h1>Actividades</h1>
            <p>Administración de actividades y sus tipos.</p>
          </div>

          <button
            type="button"
            className="btn-nueva"
            onClick={() => {
              setMostrarFormulario((prev) => !prev);
              setMensaje("");
            }}
          >
            {mostrarFormulario ? "Cerrar formulario" : "+ Nueva actividad"}
          </button>
        </div>

        {/* MENSAJES */}
        {mensaje && (
          <div
            className={`actividades-mensaje ${
              tipoMensaje === "success"
                ? "actividades-success"
                : "actividades-error"
            }`}
          >
            {mensaje}
          </div>
        )}

        {/* FORMULARIO DE ALTA */}
        {mostrarFormulario && (
          <div className="actividades-card">
            <h2>Nueva actividad</h2>

            <form onSubmit={guardarActividad}>
              <div className="actividades-form-grid">
                <div className="actividad-campo">
                  <label htmlFor="actividad-nombre">
                    NOMBRE DE LA ACTIVIDAD
                  </label>

                  <input
                    id="actividad-nombre"
                    type="text"
                    name="nombre"
                    placeholder="Ej: Combustible"
                    value={form.nombre}
                    onChange={handleChange}
                    maxLength={150}
                    required
                  />
                </div>

                <div className="actividad-campo">
                  <label htmlFor="actividad-tipo">
                    TIPO DE ACTIVIDAD
                  </label>

                  <input
                    id="actividad-tipo"
                    type="text"
                    name="tipo"
                    placeholder="Ej: Gasto, Cobro..."
                    value={form.tipo}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                </div>
              </div>

              <div className="actividad-acciones">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setForm({ nombre: "", tipo: "" });
                    setMensaje("");
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-nueva"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar actividad"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TABLA */}
        <div className="actividades-card">
          <h2>Listado de actividades</h2>

          {cargando && actividades.length === 0 ? (
            <div className="actividades-vacio">
              Cargando actividades...
            </div>
          ) : actividades.length === 0 ? (
            <div className="actividades-vacio">
              No hay actividades registradas.
            </div>
          ) : (
            <div className="tabla-contenedor">
              <table className="tabla-actividades">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                  </tr>
                </thead>

                <tbody>
                  {actividades.map((actividad) => (
                    <tr key={actividad.id}>
                      <td className="actividad-id">
                        {actividad.id}
                      </td>

                      <td>{actividad.nombre}</td>

                      <td>
                        <span className="actividad-tipo">
                          {actividad.tipo ?? "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="actividades-contador">
            Total de actividades: {actividades.length}
          </div>
        </div>
      </div>
    </>
  );
}
