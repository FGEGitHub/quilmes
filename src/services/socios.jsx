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

const borrarpaciente = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'borrarpaciente' ,datos,config)
    return data 
} 



const agregarsocio = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'agregarsocio' ,datos,config)
    return data 
} 

const crearturno = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'crearturno' ,datos,config)
    return data 
} 


const modificarusuario = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'modificarusuario' ,datos,config)
    return data 
} 
const borrarturno = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'borrarturno' ,datos,config)
    return data 
} 


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



const solicitarturno = async (datos) => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.post(baseUrl + 'solicitarturno', datos)
  return data

}
export default {solicitarturno, traerTurnosDisponibles, agendarapaciente, guardarConsulta, nuevoturnodisp, traerTurnoDetalle, modificarusuario,traerturnos, borrarturno, crearturno, traersocios , agregarsocio , traersocio, borrarpaciente}