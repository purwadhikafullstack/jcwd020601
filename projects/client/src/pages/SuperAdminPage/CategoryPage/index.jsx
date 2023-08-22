import { Box, Flex } from "@chakra-ui/react";
import NavbarFooter from "../NavbarFooter";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import Category from "./Category";
import { useState } from "react";
export default function SuperAdminPageCategory() {
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
