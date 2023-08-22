import axios from "axios";
function createApiInstance() {
  return axios.create({
    baseURL: "http://localhost:2000/",
    headers: {
      get auth() {
        return JSON.parse(localStorage.getItem("auth"));
      },
    },
  });
}

export const api = createApiInstance;
