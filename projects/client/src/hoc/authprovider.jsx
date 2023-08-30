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
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const address = JSON.parse(localStorage.getItem("address"));
      const latitude = JSON.parse(localStorage.getItem("Latitude"));
      const longitude = JSON.parse(localStorage.getItem("Longitude"));

      if (token) {
        const auth = await api()
          .get("/admin/v3?token=" + token)
          .then((res) => res.data);
        const userMainAddress = await api()
          .get("/address/ismain/" + auth?.id)
          .then((res) => res.data);
        if (auth?.role) {
          dispatch({
            type: "login",
            payload: auth,
          });
        } else if (!auth?.role) {
          const qty = await api().post("/cart/qty", {
            UserId: auth?.id,
          });
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
          dispatch({
            type: "qty",
            payload: {
              quantity: qty.data.count,
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
        setIsLoading(false);
        if (closestBranch?.BranchId) {
          dispatch({
            type: "order",
            payload: {
              BranchId: closestBranch?.BranchId,
            },
          });
        } else {
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
