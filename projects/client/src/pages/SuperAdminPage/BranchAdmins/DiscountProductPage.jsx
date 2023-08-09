import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import NavbarFooter from "../../../components/admin/NavbarFooter";
import Discount from "./discount";
import { Box, Flex } from "@chakra-ui/react";

export default function DiscountProductPage() {
  return (
    <>
      <Flex>
        <Sidebar />
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
          <Navbar />
          <Discount />
          <NavbarFooter />
        </Box>
      </Flex>
    </>
  );
}
