import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
  isLogged: false,
  hasError: false,
  isLoading: false,
  click: [],
  // click2: []
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

    // case ActionTypes.FILA_CLICKADA:
    //   return Object.assign({}, ...state, {
    //     // click: action.click
    //     click: [...state.click, action.click]
    //   });

    case ActionTypes.FILA_CLICKADA:
      return {...state, 
        click: [...state.click, action.click]
      };

    /*  case ActionTypes.FILA_CLICKADA2:
      return Object.assign({}, ...state, {
        // click: action.click
        click2: [...state.click2, action.click2]
      });*/

    /* case ActionTypes.NO_ERROR:
      return Object.assign({}, state, {
        campoError: ""
      });
      
      */

    default:
      return state;
  }
};
