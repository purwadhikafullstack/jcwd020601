import { Box, Flex } from "@chakra-ui/react";
import NavbarFooter from "../components/admin/NavbarFooter";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";
// import Product from "../components/admin/Product";
import Category from "../components/admin/Category";
// Category
export default function CategoryPage() {
  return (
    <>
      <Flex>
        <Sidebar />
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
          <Navbar />
          <Category />
          <NavbarFooter />
        </Box>
      </Flex>
    </>
  );
}
