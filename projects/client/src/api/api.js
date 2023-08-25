import axios from "axios";
function createApiInstance() {
  console.log(JSON.parse(localStorage.getItem("auth")));
  return axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
      get auth() {
        return JSON.parse(localStorage.getItem("auth"));
      },
    },
  });
}

export const api = createApiInstance;
