import { Box, Flex } from "@chakra-ui/react";
import NavbarFooter from "../components/admin/NavbarFooter";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Admin";
import Product from "../components/admin/Product";

export default function ProductPage() {
  return (
    <>
      <Flex>
        <Sidebar />
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
          <Navbar />
          <Product />
          <NavbarFooter />
        </Box>
      </Flex>
    </>
  );
}
