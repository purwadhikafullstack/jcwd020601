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
import ProfilePage from "../pages/ProfilePage";
import SuperAdminPage from "../pages/SuperAdminPage";
import OrderPage from "../pages/OrderPage";
import CategoryPage from "../pages/CategoryPage";
import AuthProvider from "../hoc/authprovider";


const routes = [
  <Route
    path="/login"
    element={
      <AuthProvider>
        <ProtectedPage guestOnly={true}>
          <LoginPage />
        </ProtectedPage>
      </AuthProvider>
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
    path="/"
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
    path="/Category"
    element={
      <ProtectedPage needLoginAdmin={true}>
        <CategoryPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/superadminpage"
    element={
      <ProtectedPage needSuperAdminLogin={true}>
        <SuperAdminPage />
      </ProtectedPage>
    }
  ></Route>,

  <Route
    path="/profile"
    element={
      <ProtectedPage needLogin={true}>
        <ProfilePage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/cart"
    element={
      <ProtectedPage needLogin={true}>
        <CartPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/order"
    element={
      <ProtectedPage needLogin={true}>
        <OrderPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/:notfound"
    element={
      <ProtectedPage>
        <NotFoundPage />
      </ProtectedPage>
    }
  ></Route>,
];
export default routes;
