import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "../api/api";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    // try {
    //   const token = JSON.parse(localStorage.getItem("auth"));
    //   // console.log(token);
    //   const user = await api
    //     .get("/auth/v3?token=" + token)
    //     .then((res) => {
    //       // console.log(res.data);
    //       return res.data;
    //     })
    //     .catch((err) => {
    //       return err.message;
    //     });
    //   if (user?.email) {
    //     dispatch({
    //       type: "login",
    //       payload: user,
    //     });
    //   } else {
    //     dispatch({
    //       type: "logout",
    //     });
    //   }
    // } catch (err) {
    //   console.log(err.message);
    // }
  }
  return children;
}
