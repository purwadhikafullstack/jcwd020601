import { Box, Flex } from "@chakra-ui/react";
import NavbarFooter from "../../components/admin/NavbarFooter";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import Product from "../../components/admin/Product";
import ReportChart from "./ReportChart";
export default function SuperAdminPage() {
  return (
    <>
      <Flex>
        <Sidebar />
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
          <Navbar />
          <ReportChart />
          <NavbarFooter />
        </Box>
      </Flex>
    </>
  );
}
