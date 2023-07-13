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
    } else if (guestOnly && userSelector?.email) {
      console.log(userSelector.email);
      return nav("/home");
    } else if (needLogin && !userSelector?.email) {
      console.log(userSelector.email);
      return nav("/login");
    } else if (needLoginAdmin && userSelector?.role != "ADMIN") {
      return nav("/login");
    }
  }, [children]);
  return (
    <>
      <>{isLoading ? <Loading /> : children}</>
    </>
  );
}
