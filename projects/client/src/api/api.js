import axios from "axios";
export const createApiInstance = () => {
  const token = JSON.parse(localStorage.getItem("auth"));
  console.log(token);
  return axios.create({
    baseURL: "http://localhost:2000/",
    headers: {
      auth: token,
    },
  });
};

export const api = createApiInstance();
