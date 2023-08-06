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
    console.log("1");
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const address = JSON.parse(localStorage.getItem("address"));
      const auth = await api
        .get("/admin/v3?token=" + token)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err.message;
        });
      const userMainAddress = await api.get("/address/ismain/" + auth?.id);

      const closestBranch = await api
        .post(
          "/address/closest",
          address
            ? { lat: address.latitude, lon: address.longitude }
            : { lat: userMainAddress.latitude, lon: userMainAddress.longitude }
        )
        .then((res) => res.data[0]);
      if (auth?.role) {
        console.log("login admin");
        dispatch({
          type: "login",
          payload: auth,
        });
      } else if (!auth?.role) {
        console.log("login user");
        dispatch({
          type: "login",
          payload: auth,
          address: address ? address : userMainAddress,
          closestBranch,
        });
      } else {
        dispatch({
          type: "logout",
        });
      }
      console.log(auth);
      console.log(userMainAddress);
      console.log("Bodh");
    } catch (err) {
      console.log(err);
    }
  }

  return children;
}
