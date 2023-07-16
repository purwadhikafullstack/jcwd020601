import { Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import AdminLogin from "../pages/AdminLogin";
import ProtectedPage from "./protectedpage";
import ForgotPassword, { RequestForgotPassword } from "../pages/ForgetPassword";
import AuthProvider from "../hoc/authprovider";
import AdminPage from "../pages/AdminPage";
import VerifyEmail from "../pages/VerifyPage";

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
    path="/Home"
    element={
      <ProtectedPage needLogin={true}>
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
    path="/verify/:token"
    element={
      <ProtectedPage>
        <VerifyEmail />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/admin"
    element={
      <ProtectedPage guestOnly={true}>
        <AdminLogin />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/adminpage"
    element={
      <ProtectedPage needLoginAdmin={true}>
        <AdminPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/superadminpage"
    element={
      <ProtectedPage needLoginSuperAdmin={true}>
        <AdminPage />
      </ProtectedPage>
    }
  ></Route>,
];
export default routes;
