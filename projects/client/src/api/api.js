import axios from "axios";
function createApiInstance() {
  // console.log(process.env.REACT_APP_API_BASE_URL);
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
