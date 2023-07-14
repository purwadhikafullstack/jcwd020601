import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.login.auth);

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      // console.log(token);
      const user = await api
        .get("/auth/v3?token=" + token)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err.message;
        });

      const admin = await api
        .get("/admin/v3?token=" + token)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err.message;
        });

      if (user?.email) {
        dispatch({
          type: "login",
          payload: user,
        });
      } else if (admin?.email) {
        dispatch({
          type: "login",
          payload: admin,
        });
      } else {
        dispatch({
          type: "logout",
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  return children;
}
