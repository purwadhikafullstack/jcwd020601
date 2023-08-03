import { Box, Flex, Center } from "@chakra-ui/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NavbarFooter from "../components/NavbarFooter";
import AllBookCard from "../components/AllBookCard";

export default function DetailBookCardPage() {
  return (
    <>
      <Box alignItems="center" justifyContent="center">
        <Navbar />
        <AllBookCard />
        <NavbarFooter />
      </Box>
    </>
  );
}
