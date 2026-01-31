
import Inicio from '../pages/inicio/index';
import Principal from '../pages/principal/index';
import Calendario from '../pages/calendario/index';
import FutbolM from '../pages/futbol-masculino/index';
import Socios from '../pages/usuariologin/socios';
import Nuevosocio from '../pages/usuariologin/nuevosocio';

import Login from '../pages/login';

const Rutas = [
 
    { path: '/', element: <Login /> },

{ path: '/inicio', element: <Inicio /> },
{ path: '/principal', element: <Principal /> },
{ path: '/calendario', element: <Calendario /> },

{ path: '/deportes/:deporte', element: <FutbolM /> },

{ path: '/login', element: <Login /> },
{ path: '/usuario/socios', element: <Socios /> },
{ path: '/usuario/nuevosocio', element: <Nuevosocio /> },



    ];


export default Rutas;