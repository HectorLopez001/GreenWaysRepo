import { combineReducers } from "redux";
import Login from "./Login";
import Register from "./Register";
import ModificarPerfilRegistrado from "./ModificarPerfilRegistrado";
import Modificar from "./Modificar";
import ModificarComercio from "./ModificarComercio";
import ModificarPerfilVendedor from "./ModificarPerfilVendedor";
import PerfilRegistrado from "./PerfilRegistrado";
import CambiarPassRegistrado from "./CambiarPassRegistrado";
import CambiarPassVendedor from "./CambiarPassVendedor";
import Main from "./Main";
import MainVendedor from "./MainVendedor";
import MainAdmin from "./MainAdmin";
import Insertar from "./Insertar";
import GestionComercios from "./GestionComercios";
import GestionComercios2 from "./GestionComercios2";
import GestionPerfilesUsuario from "./GestionPerfilesUsuario";
import GestionFeedbacks from "./GestionFeedbacks";
import GestionDenuncias from "./GestionDenuncias";
import Feedback from "./Feedback";
import Denuncia from "./Denuncia";
import Buscador from "./Buscador";
import CatalogoVendedor from "./CatalogoVendedor";
import CatalogoClientes from "./CatalogoClientes";
import CatalogoClientesFast from "./CatalogoClientesFast";

export default combineReducers({
  login: Login,
  register: Register,
  main: Main,
  mainVendedor: MainVendedor,
  mainAdmin: MainAdmin,
  perfilRegistrado: PerfilRegistrado,
  modificar: Modificar,
  modificarComercio: ModificarComercio,
  modificarPerfilRegistrado: ModificarPerfilRegistrado,
  modificarPerfilVendedor: ModificarPerfilVendedor,
  cambiarPassRegistrado: CambiarPassRegistrado,
  cambiarPassVendedor: CambiarPassVendedor,
  insertar: Insertar,
  gestionComercios: GestionComercios,
  gestionComercios2: GestionComercios2,
  gestionPerfilesUsuario: GestionPerfilesUsuario,
  gestionFeedbacks: GestionFeedbacks,
  gestionDenuncias: GestionDenuncias,
  feedback: Feedback,
  denuncia: Denuncia,
  buscador: Buscador,
  catalogoVendedor: CatalogoVendedor,
  catalogoClientes: CatalogoClientes,
  catalogoClientesFast: CatalogoClientesFast
});
