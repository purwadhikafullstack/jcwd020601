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
  needSuperAdminLogin = false,
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
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    if (redirect) {
      return nav("/login");
    } else if (needLogin && !userSelector?.email) {
      console.log(userSelector.email);
      return nav("/login");
    } else if (guestOnly && userSelector?.username && !userSelector.role) {
      return nav("/");
    } else if (needLoginAdmin && userSelector?.role != "Admin-Branch") {
      console.log(userSelector);
      return nav("/notfound");
    } else if (needSuperAdminLogin && userSelector?.role != "Super-Admin") {
      return nav("/notfound");
    } else if (
      guestOnly &&
      userSelector?.email &&
      userSelector?.role == "Admin-Branch"
    ) {
      return nav("/adminpage");
    } else if (needLogin && userSelector?.role == "Admin-Branch") {
      console.log(userSelector.email);
      return nav("/adminpage");
    } else if (needLogin && userSelector?.role == "Super-Admin") {
      return nav("/superadminpage");
    } else if (guestOnly && userSelector?.role == "Super-Admin") {
      return nav("/superadminpage");
    }
  }, [children]);
  return (
    <>
      <>{isLoading ? <Loading /> : children}</>
    </>
  );
}
