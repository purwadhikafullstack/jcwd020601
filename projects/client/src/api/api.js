import axios from "axios";
const token = JSON.parse(localStorage.getItem("auth"));
export const api = axios.create({
  baseURL: "http://localhost:2000/",
  headers: {
    auth: token,
  },
});
