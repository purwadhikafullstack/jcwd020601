const init = {
  id: "",
  email: "",
  phone: "",
  username: "",
  avatar_url: "",
  role: "",
};

function userReducer(state = init, action) {
  if (action.type === "login") {
    return {
      ...state,
      id: action.payload.id,
      email: action.payload.email,
      phone: action.payload.phone,
      first_name: action.payload.first_name,
      last_name: action.payload.last_name,
      username: action.payload.username,
      gender: action.payload.gender,
      birthdate: action.payload.birthdate,
      avatar_url: action.payload.avatar_url,
      role: action.payload.role,
      status: action.payload.status,
      address: action.address,
      branch: action.payload.branch,
      closestBranch: action.closestBranch,
    };
  } else if (action.type === "logout") {
    return init;
  }

  return state;
}

export default userReducer;
