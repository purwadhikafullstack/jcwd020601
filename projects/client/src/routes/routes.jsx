import { Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
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
    path="/HomePage"
    element={
      //   <ProtectedPage needLogin={true}>
      <HomePage />
      //   </ProtectedPage>
    }
  ></Route>,
];
export default routes;
