import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
  isLogged: false,
  hasError: false,
  isLoading: false,
  click: []
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    /*

    case ActionTypes.CAMPO_ERROR:
    return Object.assign({}, state, {
      campoError: action.campoError
    });

  case ActionTypes.NO_ERROR:
    return Object.assign({}, state, {
      campoError: ""
    });

    */

    case ActionTypes.FILA_CLICKADA4:
      
      return { ...state, 
        click: [...state.click, action.click]
      };

    case ActionTypes.RESETEAR_NUMERO_CLICKS:

      return {...state,
        click: []
      };

    /* case ActionTypes.NO_ERROR:
      return Object.assign({}, state, {
        campoError: ""
      });
      
      */

    default:
      return state;
  }
};
