import React, { Component } from "react";
import { Router, Scene } from "react-native-router-flux";
import { connect } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';
import Loader from "./../components/Loader";

import Login from "./../scenes/Login";
import Register from "./../scenes/Register";
import RegisterVendedor from "./../scenes/RegisterVendedor";

import Main from "../scenes/Main";
import MainVendedor from "../scenes/MainVendedor";
import MainAdmin from "../scenes/MainAdmin";

import Comercios from "../scenes/Comercios";
import ComerciosDetalle from "../scenes/ComerciosDetalle";

import Catalogo from "../scenes/Catalogo";
import CatalogoDetalle from "../scenes/CatalogoDetalle";

import Insertar from "../scenes/Insertar";
import CategoriasComercio from "../scenes/CategoriasComercio";
import CategoriasYCatalogo from "../scenes/CategoriasYCatalogo";

import Modificar from "../scenes/Modificar";
import ModificarPerfilRegistrado from "../scenes/ModificarPerfilRegistrado";
import ModificarPerfilVendedor from "../scenes/ModificarPerfilVendedor";

import CambiarPassRegistrado from "../scenes/CambiarPassRegistrado";
import CambiarPassVendedor from "../scenes/CambiarPassVendedor";

import ModificarComercio from "../scenes/ModificarComercio";

import CatalogoProductosAdmin from "../scenes/CatalogoProductosAdmin";
import PagComercioAdmin from "../scenes/PagComercioAdmin";
import PagPerfilUsuarioRegistradoAdmin from "../scenes/PagPerfilUsuarioRegistradoAdmin";

import PagComercio from "../scenes/PagComercio";
import PagProducto from "../scenes/PagProducto";

import PerfilRegistrado from "../scenes/PerfilRegistrado";
import PerfilVendedor from "../scenes/PerfilVendedor";
import PerfilAdmin from "../scenes/PerfilAdmin";

import GestionUsuariosRegistrados from "../scenes/GestionUsuariosRegistrados";
import GestionComercios from "../scenes/GestionComercios";

import GestionDenuncias from "../scenes/GestionDenuncias";

import GestionCatalogoProductos from "../scenes/GestionCatalogoProductos";
import GestionCategorias from "../scenes/GestionCategorias";
import GestionCategorias2 from "../scenes/GestionCategorias2";
import GestionPerfilesUsuario from "../scenes/GestionPerfilesUsuario";
import GestionFeedbacks from "../scenes/GestionFeedbacks";
import GestionPagComercio from "../scenes/GestionPagComercio";

import PagProductoVendedor from "../scenes/PagProductoVendedor";
import PagProductoAdmin from "../scenes/PagProductoAdmin";

import PagFeedbackAdmin from "../scenes/PagFeedbackAdmin";
import PagDenunciaAdmin from "../scenes/PagDenunciaAdmin";

import CatalogoClientes from "../scenes/CatalogoClientes";
import CatalogoClientesFast from "../scenes/CatalogoClientesFast";

import IntroFeedback from "../scenes/IntroFeedback";
import IntroDenuncia from "../scenes/IntroDenuncia";

import Mapa from "../scenes/Mapa";
import MapaRegistroVendedor from "../scenes/MapaRegistroVendedor";
import MapaModificarComercio from "../scenes/MapaModificarComercio";
import MapaPaginaComercio from "../scenes/MapaPaginaComercio";

import Buscador from "../scenes/Buscador";
import PagProductoBuscador from "../scenes/PagProductoBuscador";
import PagComercioBuscador from "../scenes/PagComercioBuscador";

import PagComercioMapa from "../scenes/PagComercioMapa";

import VerFeedbacksComercioProductos from "../scenes/VerFeedbacksComercioProductos";
import VerFeedbacksComercio from "../scenes/VerFeedbacksComercio";
import VerFeedbacksProductos from "../scenes/VerFeedbacksProductos";
import VerFeedbacksProducto from "../scenes/VerFeedbacksProducto";

const RouterWithRedux = connect()(Router);

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      name: null,
      isStorageLoaded: false
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("token").then(token => {
      this.setState({
        token: token
      });
    });
    AsyncStorage.getItem("name").then(name => {
      this.setState({
        name: name,
        isStorageLoaded: true
      });
    });
  }

  render() {
    let { token, isStorageLoaded } = this.state;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <RouterWithRedux>
          <Scene key="root">
            <Scene
              component={Main}
              initial={token == "registrado"}
              hideNavBar={false}
              key="Main"
              title="Main"
              type="replace"
            />
            <Scene
              component={MainVendedor}
              initial={token == "vendedor"}
              hideNavBar={false}
              key="MainVendedor"
              title="MainVendedor"
              type="replace"
            />
            <Scene
              component={MainAdmin}
              initial={token == "admin"}
              hideNavBar={false}
              key="MainAdmin"
              title="MainAdmin"
              type="replace"
            />
            <Scene
              component={Login}
              initial={!token}
              hideNavBar={false}
              key="Login"
              title="Login"
            />
            <Scene
              component={GestionComercios}
              hideNavBar={false}
              key="GestionComercios"
              title="GestionComercios"
            />
            <Scene
              component={GestionDenuncias}
              hideNavBar={false}
              key="GestionDenuncias"
              title="GestionDenuncias"
            />
            <Scene
              component={GestionPagComercio}
              hideNavBar={false}
              key="GestionPagComercio"
              title="GestionPagComercio"
            />
            <Scene
              component={GestionFeedbacks}
              hideNavBar={false}
              key="GestionFeedbacks"
              title="GestionFeedbacks"
            />
            <Scene
              component={GestionPerfilesUsuario}
              hideNavBar={false}
              key="GestionPerfilesUsuario"
              title="GestionPerfilesUsuario"
            />
            <Scene
              component={GestionCatalogoProductos}
              hideNavBar={false}
              key="GestionCatalogoProductos"
              title="GestionCatalogoProductos"
            />
            <Scene
              component={GestionCategorias}
              hideNavBar={false}
              key="GestionCategorias"
              title="GestionCategorias"
            />
            <Scene
              component={GestionCategorias2}
              hideNavBar={false}
              key="GestionCategorias2"
              title="GestionCategorias2"
            />
            <Scene
              component={GestionUsuariosRegistrados}
              hideNavBar={false}
              key="GestionUsuariosRegistrados"
              title="GestionUsuariosRegistrados"
            />
            <Scene
              component={Register}
              hideNavBar={false}
              key="Register"
              title="Register"
            />
            <Scene
              component={RegisterVendedor}
              hideNavBar={false}
              key="RegisterVendedor"
              title="RegisterVendedor"
            />
            <Scene
              component={Comercios}
              hideNavBar={false}
              key="Comercios"
              title="Comercios"
            />
            <Scene
              component={ComerciosDetalle}
              hideNavBar={false}
              key="ComerciosDetalle"
              title="Comercios"
            />
            <Scene
              component={Catalogo}
              hideNavBar={false}
              key="Catalogo"
              title="Catalogo"
            />
            <Scene
              component={CatalogoDetalle}
              hideNavBar={false}
              key="CatalogoDetalle"
              title="CatalogoDetalle"
            />
            <Scene
              component={CatalogoProductosAdmin}
              hideNavBar={false}
              key="CatalogoProductosAdmin"
              title="CatalogoProductosAdmin"
            />
            <Scene
              component={CategoriasComercio}
              hideNavBar={false}
              key="CategoriasComercio"
              title="CategoriasComercio"
            />
            <Scene
              component={CategoriasYCatalogo}
              hideNavBar={false}
              key="CategoriasYCatalogo"
              title="CategoriasYCatalogo"
            />
            <Scene
              component={Insertar}
              hideNavBar={false}
              key="Insertar"
              title="Insertar"
            />
            <Scene
              component={CambiarPassRegistrado}
              hideNavBar={false}
              key="CambiarPassRegistrado"
              title="CambiarPassRegistrado"
            />
            <Scene
              component={CambiarPassVendedor}
              hideNavBar={false}
              key="CambiarPassVendedor"
              title="CambiarPassVendedor"
            />
            <Scene
              component={Modificar}
              hideNavBar={false}
              key="Modificar"
              title="Modificar"
            />
            <Scene
              component={ModificarPerfilVendedor}
              hideNavBar={false}
              key="ModificarPerfilVendedor"
              title="ModificarPerfilVendedor"
            />
            <Scene
              component={ModificarPerfilRegistrado}
              hideNavBar={false}
              key="ModificarPerfilRegistrado"
              title="ModificarPerfilRegistrado"
            />
            <Scene
              component={ModificarComercio}
              hideNavBar={false}
              key="ModificarComercio"
              title="ModificarComercio"
            />
            <Scene
              component={PagComercio}
              hideNavBar={false}
              key="PagComercio"
              title="Página Comercio"
            />
            <Scene
              component={PagComercioAdmin}
              hideNavBar={false}
              key="PagComercioAdmin"
              title="Página Comercio Admin"
            />
            <Scene
              component={PagFeedbackAdmin}
              hideNavBar={false}
              key="PagFeedbackAdmin"
              title="Página Feedback Admin"
            />
            <Scene
              component={PagDenunciaAdmin}
              hideNavBar={false}
              key="PagDenunciaAdmin"
              title="Página Denuncia Admin"
            />
            <Scene
              component={PagPerfilUsuarioRegistradoAdmin}
              hideNavBar={false}
              key="PagPerfilUsuarioRegistradoAdmin"
              title="Perfiles Registrados Admin"
            />
            <Scene
              component={PagProducto}
              hideNavBar={false}
              key="PagProducto"
              title="PagProducto"
            />
            <Scene
              component={PagProductoVendedor}
              hideNavBar={false}
              key="PagProductoVendedor"
              title="Página Producto"
            />
            <Scene
              component={PagProductoAdmin}
              hideNavBar={false}
              key="PagProductoAdmin"
              title="Página Producto Admin"
            />
            <Scene
              component={PerfilRegistrado}
              hideNavBar={false}
              key="PerfilRegistrado"
              title="PerfilRegistrado"
            />
            <Scene
              component={PerfilVendedor}
              hideNavBar={false}
              key="PerfilVendedor"
              title="PerfilVendedor"
            />
            <Scene
              component={PerfilAdmin}
              hideNavBar={false}
              key="PerfilAdmin"
              title="PerfilAdmin"
            />
            <Scene
              component={CatalogoClientes}
              hideNavBar={false}
              key="CatalogoClientes"
              title="Catalogo de Productos"
            />
            <Scene
              component={CatalogoClientesFast}
              hideNavBar={false}
              key="CatalogoClientesFast"
              title="Catalogo de Productos"
            />
            <Scene
              component={IntroFeedback}
              hideNavBar={false}
              key="IntroFeedback"
              title="IntroFeedback"
            />
            <Scene
              component={IntroDenuncia}
              hideNavBar={false}
              key="IntroDenuncia"
              title="IntroDenuncia"
            />
            <Scene
              component={VerFeedbacksComercio}
              hideNavBar={false}
              key="VerFeedbacksComercio"
              title="VerFeedbacksComercio"
            />
            <Scene
              component={VerFeedbacksComercioProductos}
              hideNavBar={false}
              key="VerFeedbacksComercioProductos"
              title="VerFeedbacksComercioProductos"
            />
            <Scene
              component={VerFeedbacksProductos}
              hideNavBar={false}
              key="VerFeedbacksProductos"
              title="VerFeedbacksProductos"
            />
            <Scene
              component={VerFeedbacksProducto}
              hideNavBar={false}
              key="VerFeedbacksProducto"
              title="VerFeedbacksProducto"
            />
            <Scene
              component={Mapa}
              hideNavBar={false}
              key="Mapa"
              title="Mapa"
            />
            <Scene
              component={Buscador}
              hideNavBar={false}
              key="Buscador"
              title="Buscador"
            />
            <Scene
              component={PagProductoBuscador}
              hideNavBar={false}
              key="PagProductoBuscador"
              title="PagProductoBuscador"
            />
            <Scene
              component={PagComercioBuscador}
              hideNavBar={false}
              key="PagComercioBuscador"
              title="PagComercioBuscador"
            />
            <Scene
              component={MapaRegistroVendedor}
              hideNavBar={false}
              key="MapaRegistroVendedor"
              title="MapaRegistroVendedor"
            />
            <Scene
              component={MapaModificarComercio}
              hideNavBar={false}
              key="MapaModificarComercio"
              title="MapaModificarComercio"
            />
            <Scene
              component={MapaPaginaComercio}
              hideNavBar={false}
              key="MapaPaginaComercio"
              title="MapaPaginaComercio"
            />
            <Scene
              component={PagComercioMapa}
              hideNavBar={false}
              key="PagComercioMapa"
              title="PagComercioMapa"
            />
          </Scene>
        </RouterWithRedux>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    // login: state.login
  };
};

export default connect(mapStateToProps)(Root);
