import { Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import AdminLogin from "../pages/AdminLogin";
import ProtectedPage from "./protectedpage";
import ForgotPassword, { RequestForgotPassword } from "../pages/ForgetPassword";
import AuthProvider from "../hoc/authprovider";

const routes = [
  <Route
    path="/login"
    element={
      <ProtectedPage guestOnly={true}>
        <LoginPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/Register"
    element={
      <ProtectedPage guestOnly={true}>
        <RegisterPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/HomePage"
    element={
      <ProtectedPage>
        <HomePage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/forgot-password/request"
    element={
      <ProtectedPage guestOnly={true}>
        <RequestForgotPassword />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/forgot-password/:token"
    element={
      <ProtectedPage guestOnly={true}>
        <ForgotPassword />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/admin"
    element={
      <ProtectedPage needLoginAdmin={true}>
        <AdminLogin />
      </ProtectedPage>
    }
  ></Route>,
];
export default routes;
