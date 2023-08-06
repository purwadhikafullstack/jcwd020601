import { Box, Flex } from "@chakra-ui/react";
import NavbarFooter from "../../components/admin/NavbarFooter";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Product from "../../components/admin/Product";
import ReportChart from "./ReportChart";
import { useState } from "react";
import BranchAdmin from "./BranchAdmins";
export default function SuperAdminPage() {
  const [tab, setTab] = useState("Report");

  return (
    <>
      <Flex>
        <Sidebar tab={tab} setTab={setTab} />
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
          <Navbar />
          {tab == "Report" ? <ReportChart /> : <></>}
          {tab == "BranchAdmins" ? <BranchAdmin /> : <></>}
          <NavbarFooter />
        </Box>
      </Flex>
    </>
  );
}
