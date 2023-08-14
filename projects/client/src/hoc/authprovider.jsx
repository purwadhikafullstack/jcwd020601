import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";
import Loading from "../components/Loading";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.login.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    console.log("1");
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const address = JSON.parse(localStorage.getItem("address"));
      if (token) {
        console.log("Addresssess");
        const auth = await api
          .get("/admin/v3?token=" + token)
          .then((res) => res.data);
        const userMainAddress = await api
          .get("/address/ismain/" + auth?.id)
          .then((res) => res.data);
        console.log(Boolean(address));
        console.log(userMainAddress);
        console.log(address);

        // console.log(closestBranch);
        if (auth?.role) {
          console.log("login admin");
          dispatch({
            type: "login",
            payload: auth,
          });
        } else if (!auth?.role) {
          console.log("login user");
          const closestBranch = await api
            .post(
              "/address/closest",
              address
                ? { lat: address.latitude, lon: address.longitude }
                : {
                    lat: userMainAddress.latitude,
                    lon: userMainAddress.longitude,
                  }
            )
            .then((res) => res.data);
          dispatch({
            type: "login",
            payload: auth,
            address: address || userMainAddress,
            closestBranch,
          });
          dispatch({
            type: "order",
            payload: {
              BranchId: closestBranch.BranchId,
              AddressId: address.id || userMainAddress.id,
            },
          });
        } else {
          dispatch({
            type: "logout",
          });
        }
        setIsLoading(false);
      } else {
        const latitude = JSON.parse(localStorage.getItem("Latitude"));
        const longitude = JSON.parse(localStorage.getItem("Longitude"));
        const closestBranch = await api
          .post("/address/closest", {
            lat: latitude,
            lon: longitude,
          })
          .then((res) => res.data);

        setIsLoading(false);
        if (closestBranch?.BranchId) {
          dispatch({
            type: "order",
            payload: {
              BranchId: closestBranch?.BranchId,
            },
          });
        } else {
          console.log(closestBranch);
        }
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  return (
    <>
      <>{isLoading ? <Loading /> : children}</>
    </>
  );
}
