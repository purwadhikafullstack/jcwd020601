import { Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminPage from "../pages/AdminPage";
import ForgotPassword, {
  RequestForgotPassword,
} from "../pages/ForgetPassword.jsx";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyEmail from "../pages/VerifyPage";
import ProtectedPage from "./protectedpage";
import NotFoundPage from "../pages/NotFoundPage";


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
      <ProtectedPage>
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
      <ProtectedPage needSuperAdminLogin={true}>
        <AdminPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/superadminpage"
    element={
      <ProtectedPage needSuperAdminLogin={true}>
        <AdminPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/:notfound"
    element={
      <ProtectedPage guestOnly={true}>
        <NotFoundPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/cart"
    element={
      //   <ProtectedPage needLogin={true}>
      <CartPage />
      //   </ProtectedPage>
    }
  ></Route>,
];
export default routes;
