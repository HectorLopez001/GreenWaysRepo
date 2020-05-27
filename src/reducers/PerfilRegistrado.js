import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
  isLogged: false,
  hasError: false,
  isLoading: false,
  name: "",
  username: "",
  password: ""
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.PERFILREGISTRADO_HAS_ERROR:
      return Object.assign({}, state, {
        hasError: action.hasError
      });
    case ActionTypes.PERFILREGISTRADO_IS_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      });

    default:
      return state;
  }
};
