import { Box, Flex } from "@chakra-ui/react";
import NavbarFooter from "../components/admin/NavbarFooter";
import Sidebar from "./SuperAdminPage/Sidebar";
import Navbar from "../components/admin/Admin";
import Category from "../components/admin/Category";
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
