import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthProvider from "../hoc/authprovider";

export default function ProtectedPage({
  children,
  redirect = false,
  guestOnly = false,
  needLogin = false,
  needLoginAdmin = false,
  noFooter = false,
}) {
  const userSelector = useSelector((state) => state.login.auth);
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [isLoading]);
  useEffect(() => {
    // alert("hello");
    setIsLoading(true);

    setTimeout(() => {
      //   alert(isLoading);
      setIsLoading(false);
    }, 500);
    if (redirect) {
      console.log(userSelector.email);
      return nav("/login");
    } else if (guestOnly && userSelector?.email && !userSelector.role) {
      console.log(userSelector);
      return nav("/home");
    } else if (
      guestOnly &&
      userSelector?.email &&
      userSelector?.role == "Admin-Branch"
    ) {
      console.log(userSelector.role);
      return nav("/adminpage");
    } else if (needLoginAdmin && userSelector?.role != "Admin-Branch") {
      console.log(userSelector);
      return nav("/login");
    } else if (needLogin && userSelector?.role == "Admin-Branch") {
      console.log(userSelector.email);
      return nav("/adminpage");
    } else if (needLogin && !userSelector?.email) {
      console.log(userSelector.email);
      return nav("/login");
    }
  }, [children]);
  return (
    <>
      <>{isLoading ? <Loading /> : children}</>
    </>
  );
}
