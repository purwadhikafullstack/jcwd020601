import { Box, Flex } from "@chakra-ui/react";
import CarouselShow from "../components/CarouselShow";
import Navbar from "../components/Navbar";
import CarouselBooks from "../components/CarouselBooks";
import BookCard from "../components/BookCard";
import CarouselAll from "../components/CarouselAll";
import Footer from "../components/Footer";
import NavbarFooter from "../components/NavbarFooter";

export default function HomePage() {
  return (
    <Flex display={"colums"}>
      <Navbar></Navbar>
      <CarouselShow />
      <CarouselBooks />
      <BookCard />
      <CarouselAll />
      <Footer />
      <NavbarFooter />
    </Flex>
  );
}
