import { Box, Flex } from "@chakra-ui/react";
import NavbarFooter from "../NavbarFooter";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import OrderListPage from "./OrderListPage";

export default function SuperAdminPageOrder() {
  return (
    <>
      <Flex>
        <Sidebar />
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
          <Navbar />
          <OrderListPage></OrderListPage>
          <NavbarFooter />
        </Box>
      </Flex>
    </>
  );
}
