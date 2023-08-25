import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import NavbarFooter from "./NavbarFooter";
// import Discount from "./discount";
// import BranchOrder from "./branchOrder";
import { Box, Flex } from "@chakra-ui/react";
import BranchOrder from "./branchOrder/BranchOrder";

export default function BranchOrderPage() {
  return (
    <>
      <Flex>
        <Sidebar />
        <Box
          display={"flex"}
          flexDirection={"column"}
          width={"100%"}
          overflow={"hidden"}
        >
          <Navbar />
          <BranchOrder />
          {/* <NavbarFooter /> */}
        </Box>
      </Flex>
    </>
  );
}
