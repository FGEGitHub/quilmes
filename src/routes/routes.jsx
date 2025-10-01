
import Inicio from '../pages/inicio/index';
import Principal from '../pages/principal/index';
import Calendario from '../pages/calendario/index';
import FutbolM from '../pages/futbol-masculino/index';
import FutbolF from '../pages/futbol-masculino/index';
const Rutas = [
 
    { path: '/', element: <Inicio /> },

{ path: '/inicio', element: <Inicio /> },
{ path: '/principal', element: <Principal /> },
{ path: '/calendario', element: <Calendario /> },

{ path: '/deportes/futbol-masculino', element: <FutbolM /> },
{ path: '/deportes/futbol-feminino', element: <FutbolF /> },
{ path: '/deportes/hockey-masculino', element: <FutbolM /> },
{ path: '/deportes/hockey-femenino', element: <FutbolM /> },
{ path: '/deportes/cesto', element: <FutbolM /> },

    ];


export default Rutas;