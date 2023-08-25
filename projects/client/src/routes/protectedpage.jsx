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
  guestAndLogin = false,
  noFooter = false,
}) {
  const userSelector = useSelector((state) => state.login.auth);
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("2");
    if (redirect) {
      console.log("a");
      setIsLoading(false);
      return nav("/login");
    } else if (needLogin && !userSelector?.email) {
      console.log("b");
      setIsLoading(false);
      console.log(userSelector.email);
      return nav("/login");
    } else if (guestOnly && userSelector?.username && !userSelector.role) {
      console.log("c");
      setIsLoading(false);
      return nav("/");
    } else if (needLoginAdmin && userSelector?.role != "Admin-Branch") {
      console.log("d");
      console.log(userSelector);
      setIsLoading(false);
      return nav("/notfound");
    } else if (needSuperAdminLogin && userSelector?.role != "Super-Admin") {
      console.log("e");
      setIsLoading(false);
      return nav("/notfound");
    } else if (
      guestOnly &&
      userSelector?.email &&
      userSelector?.role == "Admin-Branch"
    ) {
      console.log("f");
      setIsLoading(false);
      return nav("/admin");
    } else if (needLogin && userSelector?.role == "Admin-Branch") {
      console.log("g");
      setIsLoading(false);
      return nav("/admin");
    } else if (guestAndLogin && userSelector?.role == "Admin-Branch") {
      console.log("h");
      setIsLoading(false);
      return nav("/admin");
    } else if (needLogin && userSelector?.role == "Super-Admin") {
      console.log("i");
      setIsLoading(false);
      return nav("/superadminpage");
    } else if (guestAndLogin && userSelector?.role == "Super-Admin") {
      console.log(guestAndLogin);
      console.log("j");
      setIsLoading(false);
      return nav("/superadminpage");
    } else if (guestOnly && userSelector?.role == "Super-Admin") {
      console.log("k");
      setIsLoading(false);
      return nav("/superadminpage");
    } else {
      console.log("l");
      setIsLoading(false);
    }
  }, [children]);
  return (
    <>
      <>{isLoading ? <Loading /> : children}</>
    </>
  );
}
