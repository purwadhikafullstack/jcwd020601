import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";
import Loading from "../components/Loading";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    console.log("1");
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const address = JSON.parse(localStorage.getItem("address"));
      const latitude = JSON.parse(localStorage.getItem("Latitude"));
      const longitude = JSON.parse(localStorage.getItem("Longitude"));
      console.log(token);

      if (token) {
        const auth = await api()
          .get("/admin/v3?token=" + token)
          .then((res) => res.data);
        const userMainAddress = await api()
          .get("/address/ismain/" + auth?.id)
          .then((res) => res.data);
        console.log(userMainAddress);
        if (auth?.role) {
          console.log("login admin");
          dispatch({
            type: "login",
            payload: auth,
          });
        } else if (!auth?.role) {
          console.log("login user");
          console.log(address);

          const closestBranch = await api()
            .post(
              "/address/closest",
              address
                ? { lat: address.latitude, lon: address.longitude }
                : userMainAddress
                ? {
                    lat: userMainAddress.latitude,
                    lon: userMainAddress.longitude,
                  }
                : { lat: latitude, lon: longitude }
            )
            .then((res) => res.data);
          console.log(closestBranch);
          dispatch({
            type: "login",
            payload: { token, ...auth },
            address: address || userMainAddress,
            closestBranch,
          });
          dispatch({
            type: "order",
            payload: {
              BranchId: closestBranch.BranchId,
              TooFar: closestBranch.TooFar,
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
        const closestBranch = await api()
          .post("/address/closest", {
            lat: latitude,
            lon: longitude,
          })
          .then((res) => res.data);
        console.log(closestBranch);

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
