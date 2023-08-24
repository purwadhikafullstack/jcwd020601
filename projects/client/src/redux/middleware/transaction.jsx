const init = {
  BranchId: "",
  AddressId: "",
  shipping: "",
  courier: "",
  // quantity: 0,
};

function transactionReducer(state = init, action) {
  if (action.type === "order") {
    return {
      ...state,
      BranchId: action.payload.BranchId,
      TooFar: action.payload.TooFar,
      origin: action.payload.origin,
      AddressId: action.payload.AddressId,
      destination: action.payload.destination,
      shipping: action.payload.shipping,
      courier: action.payload.courier,
      weight: action.payload.weight,
      // quantity: action.payload.quantity,
    };
    // } else if (action.type === "logout") {
    //   return init;
  }

  return state;
}

export default transactionReducer;
