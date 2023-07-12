import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import routes from "./routes/routes";
import { Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";

function App() {
  const [message, setMessage] = useState("");

  return <Routes>{routes.map((val) => val)}</Routes>;
}

export default App;
