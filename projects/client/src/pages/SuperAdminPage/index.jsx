import { Box, Flex } from "@chakra-ui/react";
import NavbarFooter from "./NavbarFooter";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Product from "./ProductPage/Product";
import ReportChart from "./ReportChart";
import { useState } from "react";
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
