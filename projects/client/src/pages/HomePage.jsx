import { Box, Flex } from "@chakra-ui/react";
import CarouselShow from "../components/CarouselShow";
import Navbar from "../components/Navbar";
import CarouselBooks from "../components/CarouselBooks";
import BookCard from "../components/BookCard";
import CarouselAll from "../components/CarouselAll";
import Footer from "../components/Footer";
import NavbarFooter from "../components/NavbarFooter";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

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

  function showPosition(position) {
    localStorage.setItem("Latitude", JSON.stringify(position.coords.latitude));
    localStorage.setItem(
      "Longitude",
      JSON.stringify(position.coords.longitude)
    );
    x.innerHTML =
      "Latitude: " +
      position.coords.latitude +
      "<br>Longitude: " +
      position.coords.longitude;
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
