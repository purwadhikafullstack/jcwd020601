const init = {
  quantity: 0,
};

function quantityReducer(state = init, action) {
  if (action.type === "qty") {
    return {
      ...state,
      quantity: action.payload.quantity,
    };
  }

  return state;
}

export default quantityReducer;
