import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";

const goPrincipal = () => {
  Actions.MainAdmin();
  return {
    type: ActionTypes.MAINADMIN
  };
};

export default {
  goPrincipal
};
