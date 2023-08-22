import axios from "axios";
let token = JSON.parse(localStorage.getItem("auth"));
console.log(token);

let apiLink = axios.create({
  baseURL: "http://localhost:2000/",
  headers: {
    auth: token,
  },
});
function setApi() {
  const tokena = JSON.parse(localStorage.getItem("auth"));
  apiLink = axios.create({
    baseURL: "http://localhost:2000/",
    headers: {
      auth: tokena,
    },
  });
  console.log(tokena);
}
const apis = {
  setApi,
  apiLink,
};
export default apis;
