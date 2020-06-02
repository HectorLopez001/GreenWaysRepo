import { combineReducers } from "redux";
import Login from "./../reducers/Login";
import Register from "./../reducers/Register";
import Modificar from "./../reducers/Modificar";
import ModificarComercio from "./../reducers/ModificarComercio";
import ModificarPerfilRegistrado from "./../reducers/ModificarPerfilRegistrado";
import ModificarPerfilVendedor from "./../reducers/ModificarPerfilVendedor";
import PerfilRegistrado from "./../reducers/PerfilRegistrado";
import CambiarPassRegistrado from "./../reducers/CambiarPassRegistrado";
import CambiarPassVendedor from "./../reducers/CambiarPassVendedor";
import Main from "./../reducers/Main";
import MainVendedor from "./../reducers/MainVendedor";
import MainAdmin from "./../reducers/MainAdmin";
import Insertar from "./../reducers/Insertar";
import GestionComercios from "./../reducers/GestionComercios";
import GestionComercios2 from "./../reducers/GestionComercios2";
import GestionPerfilesUsuario from "./../reducers/GestionPerfilesUsuario";
import GestionFeedbacks from "./../reducers/GestionFeedbacks";
import GestionDenuncias from "./../reducers/GestionDenuncias";
import Feedback from "./../reducers/Feedback";
import Denuncia from "./../reducers/Denuncia";
import Buscador from "./../reducers/Buscador";
import CatalogoVendedor from "./../reducers/CatalogoVendedor";
import CatalogoClientes from "./../reducers/CatalogoClientes";
import CatalogoClientesFast from "./../reducers/CatalogoClientesFast";

export default combineReducers({
  login: Login,
  register: Register,
  main: Main,
  mainVendedor: MainVendedor,
  mainAdmin: MainAdmin,
  insertar: Insertar,
  perfilRegistrado: PerfilRegistrado,
  modificar: Modificar,
  modificarComercio: ModificarComercio,
  modificarPerfilRegistrado: ModificarPerfilRegistrado,
  modificarPerfilVendedor: ModificarPerfilVendedor,
  CambiarPassRegistrado: CambiarPassRegistrado,
  CambiarPassVendedor: CambiarPassVendedor,
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
