import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
// import NavbarFooter from "../../../components/admin/NavbarFooter";
// import Discount from "./discount";
import Stock from "./stock";
import { Box, Flex } from "@chakra-ui/react";

export default function StockProduct() {
  return (
    <>
      <Flex>
        <Sidebar />
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
          <Navbar />
          <Stock />
          {/* <NavbarFooter /> */}
        </Box>
      </Flex>
    </>
  );
}
