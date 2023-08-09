import { Box, Flex } from "@chakra-ui/react";
import NavbarFooter from "../NavbarFooter";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import Product from "../Product";
import { useState } from "react";
export default function SuperAdminPageProduct() {
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
