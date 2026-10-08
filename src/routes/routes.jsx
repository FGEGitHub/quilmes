
import Inicio from '../pages/inicio/index';
import Principal from '../pages/principal/index';
import Calendario from '../pages/calendario/index';
import FutbolM from '../pages/futbol-masculino/index';
import Socios from '../pages/usuariologin/socios';
import Nuevosocio from '../pages/usuariologin/nuevosocio';
import Socioadmin from '../pages/usuariologin/socio';
import Cuotasadmin from '../pages/usuariologin/cuotas';
import Cargaractividades from '../pages/usuariologin/agregaract';
import Dashboard from '../pages/usuariologin/dashboard1';
import Cobroslog from '../pages/usuariologin/cobros';
import Indumentarialog from '../pages/usuariologin/indumentaria';
import Cajalog from '../pages/usuariologin/caja';
import Partidoslog from '../pages/usuariologin/partidos';
import Iniciolog from '../pages/usuariologin/inicio';
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
{ path: '/usuario/socio/:id', element: <Socioadmin /> },
{ path: '/usuario/socio/:id', element: <Socioadmin /> },
{ path: '/usuario/cuotas', element: <Cuotasadmin /> },
{ path: '/usuario/cargaract', element: <Cargaractividades /> },
{ path: '/usuario/dashboard', element: <Dashboard /> },
{ path: '/usuario/inicio', element: <Iniciolog /> },
{ path: '/usuario/indumentaria', element: <Indumentarialog /> },
{ path: '/usuario/caja', element: <Cajalog /> },
{ path: '/usuario/partidos', element: <Partidoslog /> },
{ path: '/usuario/cobros', element: <Cobroslog /> },
    ];


export default Rutas;