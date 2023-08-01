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
      const address = JSON.parse(localStorage.getItem("address"));

      console.log(token);

      const user = await api
        .get("/auth/v3?token=" + token)
        .then(async (res) => {
          console.log(res.data);
          return res.data;
        })
        .catch((err) => {
          console.log(err.message);
          return err.message;
        });
      console.log(user?.email);
      const userMainAddress = await api
        .get("/address/ismain/" + user?.id)
        .then((res) => res.data)
        .catch((err) => {
          return err.message;
        });
      console.log(user?.email);
      const admin = await api
        .get("/admin/v3?token=" + token)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err.message;
        });

      if (user?.email) {
        console.log(user?.email);
        dispatch({
          type: "login",
          payload: user,
          address: address ? address : userMainAddress,
        });
      } else if (admin?.email) {
        console.log(admin?.email);
        dispatch({
          type: "login",
          payload: admin,
        });
      } else {
        console.log("ksadjasjd");
        await dispatch({
          type: "logout",
        });
      }
      console.log("Bodh");
    } catch (err) {
      console.log(err.message);
    }
  }

  return children;
}
