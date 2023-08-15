import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Stock from "./stock";
import NavbarFooter from "./NavbarFooter";
import { Box, Flex } from "@chakra-ui/react";

export default function StockProduct() {
  return (
    <>
      <Flex overflow={"hidden"}>
        <Sidebar overflow={"hidden"} />
        <Box
          display={"flex"}
          flexDirection={"column"}
          width={"100%"}
          // position={"absolute"}
          overflow={"hidden"}
          // zIndex={-10}
        >
          <Navbar />
          <Stock />
          <NavbarFooter />
        </Box>
      </Flex>
    </>
  );
}
