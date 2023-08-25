import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import routes from "./routes/routes";
import { Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import Loading from "./components/Loading";
import AuthProvider from "./hoc/authprovider";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isLoading]);
  return (
    <>
      {isLoading ? (
        <Loading /> // <Loading />
      ) : (
        <Routes>{routes.map((val) => val)}</Routes>
      )}
    </>
  );
}
export default App;
