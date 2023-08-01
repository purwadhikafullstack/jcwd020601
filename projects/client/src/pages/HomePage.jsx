import { Box, Flex } from "@chakra-ui/react";
import CarouselShow from "../components/CarouselShow";
import Navbar from "../components/Navbar";
import CarouselBooks from "../components/CarouselBooks";
import BookCard from "../components/BookCard";
import CarouselAll from "../components/CarouselAll";
import Footer from "../components/Footer";
import NavbarFooter from "../components/NavbarFooter";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";

export default function HomePage() {
  const userSelector = useSelector((state) => state.login.auth);
  const dispatch = useDispatch();
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

  async function showPosition(position) {
    localStorage.setItem("Latitude", JSON.stringify(position.coords.latitude));
    localStorage.setItem(
      "Longitude",
      JSON.stringify(position.coords.longitude)
    );
    const address = await api
      .post("address/lat", {
        latitude: JSON.stringify(position.coords.latitude),
        longitude: JSON.stringify(position.coords.longitude),
      })
      .then((res) => {
        return res.data;
      });
    console.log("safjas");
  }
  return (
    <Flex display={"columns"}>
      <Navbar />
      <Flex
        onClick={() => {
          console.log(userSelector);
        }}
      >
        lol
      </Flex>
      <CarouselShow />
      <CarouselBooks />
      <BookCard />
      <CarouselAll />
      <Footer />
      <NavbarFooter />
    </Flex>
  );
}
