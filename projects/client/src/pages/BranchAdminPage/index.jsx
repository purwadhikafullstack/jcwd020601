import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import NavbarFooter from "./NavbarFooter";
// import Discount from "./discount";
import ReportChart from "./ReportChart";
import { Box, Flex } from "@chakra-ui/react";

export default function AdminPage() {
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
