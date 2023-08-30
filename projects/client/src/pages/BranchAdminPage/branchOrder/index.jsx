import { Box, Flex } from "@chakra-ui/react";
// import NavbarFooter from "../NavbarFooter";
// import Sidebar from "../Sidebar";
// import Navbar from "../Navbar";
import { useEffect, useState } from "react";
import { api } from "../../../api/api";

export default function BranchOrder() {
  const [trans, setTrans] = useState();
  async function fetch() {
    const result = await api().post("/order/branch", {
      BranchId: 1,
    });
    return setTrans(result.data);
  }
  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      <Box marginLeft={60} h={"80vh"} overflow={"auto"}></Box>
    </>
  );
}
