import { Box, Flex } from "@chakra-ui/react";
import CarouselShow from "../components/CarouselShow";
import Navbar from "../components/Navbar2";
import CarouselBooks from "../components/CarouselBooks";
import BookCard from "../components/BookCard";
import CarouselAll from "../components/CarouselAll";
import Footer from "../components/Footer";
import NavbarFooter from "../components/NavbarFooter";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logDOM } from "@testing-library/react";

export default function HomePage() {
  const orderSelector = useSelector((state) => state.login.order);
  const userSelector = useSelector((state) => state.login.auth);
  const dispatch = useDispatch();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const token = JSON.parse(localStorage.getItem("auth"));

  var x = document.getElementById("demo");
  useEffect(() => {
    getLocation();
  }, []);
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  async function showPosition(position) {
    localStorage.setItem("Latitude", JSON.stringify(position.coords.latitude));
    localStorage.setItem(
      "Longitude",
      JSON.stringify(position.coords.longitude)
    );
  }
  return (
    <Flex display={"columns"}>
      <Navbar />
      <CarouselShow />
      <CarouselBooks />
      <BookCard />
      <CarouselAll />
      <Footer />
      <NavbarFooter />
    </Flex>
  );
}
