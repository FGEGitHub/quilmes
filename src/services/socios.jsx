import axios from "axios"



const API = import.meta.env.VITE_API_URL;

const baseUrl = API+'quilmes/'
let token = null

const setToken = newToken => {

  token = `Bearer ${newToken}`
}

const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

let config = ''
if (loggedUserJSON) {

    try {
        const userContext = JSON.parse(loggedUserJSON)
        config = {
           headers:{
               Authorization:`Bearer ${userContext.token}`
           }
       }
    } catch (error) {
          window.localStorage.removeItem('loggedNoteAppUser')
     
    }
   

    
}else{
     config = {
        headers:{
            Authorization:`Bearer `
        }
    }
}


const traersocios = async () => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'traersocios/' ,config)
  return data

}

const traerturnos = async () => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'traerturnos/' ,config)
  return data

}


const eliminarsocio = async (id) => {
  const { data } = await axios.delete(
    baseUrl + "eliminarsocio/" + id,
    config
  );

  return data;
};

const traerTurnosDisponibles = async () => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'traerTurnosDisponibles/' ,config)
  return data

}
const traersocio = async (id) => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'traersocio/'+id ,config)
  return data

}


const traercuotas = async (id) => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'traercuotas/'+id ,config)
  return data

}

const traercuotastodas = async () => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'traercuotastodas/' ,config)
  return data

}
const borrarpaciente = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'borrarpaciente' ,datos,config)
    return data 
} 



const agregarsocio = async (datos) => {
  try {
    const { data } = await axios.post(
      baseUrl + "agregarsocio",
      datos,
      config
    );

    return data;

  } catch (error) {

    // 👇 Acá viene el mensaje del backend
    if (error.response) {
      console.log(error.response.data);
      alert(error.response.data);
      throw error.response.data; // reenviamos el mensaje
    }

    throw "Error al conectar con el servidor";
  }
};


const crearturno = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'crearturno' ,datos,config)
    return data 
} 


const modificarusuario = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'modificarusuario' ,datos,config)
    return data 
} 
const actualizarsocio = async (datos) => {
  const { data } = await axios.post(
    baseUrl + "actualizarsocio",
    datos
  );
  return data;
};



const guardarConsulta = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'guardarConsulta' ,datos,config)
    return data 
} 


const traerTurnoDetalle = async (id) => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'traerTurnoDetalle/'+id ,config)
  return data

}


const nuevoturnodisp = async (datos) => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.post(baseUrl + 'nuevoturnodisp', datos)
  return data

}



const agendarapaciente = async (datos) => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.post(baseUrl + 'agendarapaciente', datos)
  return data

}



const pagarcuota = async (datos) => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.post(baseUrl + 'pagarcuota', datos)
  return data

}


const enviagregastonuevo = async (datos) => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.post(baseUrl + 'enviagregastonuevo', datos)
  return data

}


const traeractividades = async () => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'traeractividades/' ,config)
  return data

}




const traerGastos = async () => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'traerGastos/' ,config)
  return data

}


export const traerdatosinicio = async ({ id, mes, anio }) => {
  const response = await axios.get(baseUrl +"/traerdatosinicio", {
    params: { id, mes, anio },
  });

  return response.data;
};


const agregaractividad = async (datos) => {
  const { data } = await axios.post(
    baseUrl + "agregaractividad",
    datos
  );

  return data;
};


// ===============================
// PARTIDOS QUILMES
// ===============================

// Listar partidos
export const quilmesListarPartidos = async (params = {}) => {
  const { data } = await axios.get(
    baseUrl + "PARTIDOS/quilmes_listar_partidos",
    { params }
  );
  return data;
};

// Obtener resumen económico
export const quilmesResumenPartidos = async (params = {}) => {
  const { data } = await axios.get(
    baseUrl + "PARTIDOS/quilmes_resumen_partidos",
    { params }
  );
  return data;
};

// Obtener un partido con sus movimientos
export const quilmesObtenerPartido = async (id) => {
  const { data } = await axios.get(
    baseUrl + `PARTIDOS/quilmes_obtener_partido/${id}`
  );
  return data;
};

// Listar categorías
export const quilmesListarCategorias = async () => {
  const { data } = await axios.get(
    baseUrl + "PARTIDOS/quilmes_listar_categorias"
  );
  return data;
};

// Crear partido
export const quilmesCrearPartido = async (datos) => {
  const { data } = await axios.post(
    baseUrl + "PARTIDOS/quilmes_crear_partido",
    datos
  );
  return data;
};

// Editar partido
export const quilmesEditarPartido = async (id, datos) => {
  const { data } = await axios.put(
    baseUrl + `PARTIDOS/quilmes_editar_partido/${id}`,
    datos
  );
  return data;
};

// Agregar ingreso o gasto
export const quilmesAgregarMovimiento = async (id, datos) => {
  const { data } = await axios.post(
    baseUrl + `PARTIDOS/quilmes_agregar_movimiento/${id}`,
    datos
  );
  return data;
};

// Eliminar partido
export const quilmesEliminarPartido = async (id) => {
  const { data } = await axios.delete(
    baseUrl + `PARTIDOS/quilmes_eliminar_partido/${id}`
  );
  return data;
};



export default {
  agregaractividad,
  traerGastos,
  traerdatosinicio,
  traeractividades,
  enviagregastonuevo,
  eliminarsocio,
  traercuotastodas,
  traercuotas,
  pagarcuota,
  traerTurnosDisponibles,
  agendarapaciente,
  guardarConsulta,
  nuevoturnodisp,
  traerTurnoDetalle,
  modificarusuario,
  traerturnos,
  actualizarsocio,
  crearturno,
  traersocios,
  agregarsocio,
  traersocio,
  borrarpaciente,

  // Partidos Quilmes
  quilmesListarPartidos,
  quilmesResumenPartidos,
  quilmesObtenerPartido,
  quilmesListarCategorias,
  quilmesCrearPartido,
  quilmesEditarPartido,
  quilmesAgregarMovimiento,
  quilmesEliminarPartido,
};