import { Route, Router } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import ProductPage from "../pages/ProductPage";
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
import DetailBookCardPage from "../pages/DetailBookCardPage";
import DetailBookPage from "../pages/DetailBookPage";
import DiscountProduct from "../pages/BranchAdminPage/DiscountProduct";
// import BranchAdmin from "../pages/SuperAdminPage/BranchAdminPage";
// import Product from "../pages/SuperAdminPage/Product";
// import SuperAdminPageProduct from "../pages/SuperAdminPage/ProductPage";
// import SuperAdminPageBranchAdmin from "../pages/SuperAdminPage/BranchAdminPage";
import StockProduct from "../pages/BranchAdminPage/StockProduct";
import BranchAdmin from "../pages/SuperAdminPage/AdminManagementPage";
import Product from "../pages/SuperAdminPage/ProductPage/Product";
import SuperAdminPageProduct from "../pages/SuperAdminPage/ProductPage";
import SuperAdminPageBranchAdmin from "../pages/SuperAdminPage/AdminManagementPage";
import BranchOrderPage from "../pages/BranchAdminPage/BranchOrderPage";
import AdminPage from "../pages/BranchAdminPage";
import FIlterPage from "../pages/FilterPage";
import SuperAdminPageCategory from "../pages/SuperAdminPage/CategoryPage";

import SuperAdminPageOrder from "../pages/SuperAdminPage/OrderPage.jsx";

import MyOrdersPage from "../pages/MyOrdersPage";

// import StockProductPage from "../pages/SuperAdminPage/BranchAdmins/StockProductPage";
// >>>>>>> develop

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
      <ProtectedPage guestAndLogin={true}>
        <HomePage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/products"
    element={
      <ProtectedPage>
        <DetailBookCardPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/products/filter"
    element={
      <ProtectedPage>
        <FIlterPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/products/filter/:categoryId"
    element={
      <ProtectedPage>
        <FIlterPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/products/detail/:id"
    element={
      <ProtectedPage>
        <DetailBookPage />
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
    path="/adminlogin"
    element={
      <ProtectedPage guestOnly={true}>
        <AdminLogin />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/admin"
    element={
      <ProtectedPage needLoginAdmin={true}>
        <AdminPage />
      </ProtectedPage>
    }
  ></Route>,

  <Route
    path="/admin/discount"
    element={
      <ProtectedPage needLoginAdmin={true}>
        <DiscountProduct />
      </ProtectedPage>
    }
  ></Route>,

  <Route
    path="/admin/order"
    element={
      <ProtectedPage needLoginAdmin={true}>
        <BranchOrderPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/admin/stock"
    element={
      <ProtectedPage needLoginAdmin={true}>
        <StockProduct />
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
    path="/superadminpage/product"
    element={
      <ProtectedPage needSuperAdminLogin={true}>
        <SuperAdminPageProduct />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/superadminpage/branchadmin"
    element={
      <ProtectedPage needSuperAdminLogin={true}>
        <SuperAdminPageBranchAdmin />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/superadminpage/category"
    element={
      <ProtectedPage needSuperAdminLogin={true}>
        <SuperAdminPageCategory />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/superadminpage/order"
    element={
      <ProtectedPage needSuperAdminLogin={true}>
        <SuperAdminPageOrder />
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
    path="/orders"
    element={
      <ProtectedPage needLogin={true}>
        <MyOrdersPage />
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
    path="/order/:id"
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
