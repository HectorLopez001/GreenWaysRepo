import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";

/*const goPrincipal = () => {
  Actions.Main();
  return {
    type: ActionTypes.MAIN
  };
};*/

const goCambiarPass = () => {
  Actions.CambiarPassVendedor();
  return {
    type: ActionTypes.CAMBIAR_PASS_VENDEDOR
  };
};

const goModificarPerfilVendedor = () => {
  Actions.ModificarPerfilVendedor();
  return {
    type: ActionTypes.MODIFICARPERFILVENDEDOR
  };
};

export default {
  //goPrincipal,
  goModificarPerfilVendedor,
  goCambiarPass
};
