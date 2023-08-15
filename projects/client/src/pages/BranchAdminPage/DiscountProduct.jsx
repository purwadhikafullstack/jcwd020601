import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import NavbarFooter from "./NavbarFooter";
import Discount from "./discount";
import { Box, Flex } from "@chakra-ui/react";

export default function DiscountProduct() {
  return (
    <>
      <Flex>
        <Sidebar />
        <Box
          display={"flex"}
          flexDirection={"column"}
          width={"100%"}
          overflow={"hidden"}
        >
          <Navbar />
          <Discount />
          <NavbarFooter />
        </Box>
      </Flex>
    </>
  );
}
