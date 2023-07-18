import { Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";

// import RegisterPage from "../pages/Registerpage";
// import ProtectedPage from "./protectedpage";

const routes = [
  <Route
    path="/login"
    element={
      //   <ProtectedPage guestOnly={true}>
      <LoginPage />
      //   </ProtectedPage>
    }
  ></Route>,
  //   <Route
  //     path="/Register"
  //     element={
  //       <ProtectedPage guestOnly={true}>
  //         <RegisterPage />
  //       </ProtectedPage>
  //     }
  //   ></Route>,
  <Route
    path="/home"
    element={
      //   <ProtectedPage needLogin={true}>
      <HomePage />
      //   </ProtectedPage>
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
