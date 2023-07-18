import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import routes from "./routes/routes";
import { Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import Loading from "./components/Loading";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
