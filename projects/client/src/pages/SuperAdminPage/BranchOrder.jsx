import { Box, Flex } from "@chakra-ui/react";
import NavbarFooter from "../../components/admin/NavbarFooter";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Admin";
import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function BranchOrder() {
  const [trans, setTrans] = useState();

  // GET
  async function fetch() {
    const result = await api.post("/order/branch", {
      BranchId: 1,
    });
    return setTrans(result.data);
  }

  console.log(trans);

  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      <Flex>
        <Sidebar />
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
          <Navbar />
          {/* transaction on branch */}
          {trans?.map((val) => {
            return (
              <Flex height={"100px"} width={"100px"}>
                {val.total}
              </Flex>
            );
          })}
          {/* <Flex bgColor={"red"} height={"100px"} width={"100px"}></Flex> */}
          <Flex>
            <Flex></Flex>
          </Flex>
          <NavbarFooter />
        </Box>
      </Flex>
    </>
  );
}
