
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

{ path: '/deportes/:deporte', element: <FutbolM /> },
    ];


export default Rutas;