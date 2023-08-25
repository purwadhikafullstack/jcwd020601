import { Box, Flex, Center } from "@chakra-ui/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NavbarFooter from "../components/NavbarFooter";
import AllBookCard from "../components/AllBookCard";
import { useState } from "react";

export default function DetailBookCardPage() {
  const [keyword, setkeyword] = useState("");
  const inputSearch = (e) => {
    setkeyword(e.target.value);
  };
  console.log(keyword);
  return (
    <>
      <Box alignItems="center" justifyContent="center" height={"100vh"}>
        <Navbar callback={inputSearch} keyword={keyword} />
        <AllBookCard keyword={keyword} />
        <NavbarFooter />
      </Box>
    </>
  );
}
