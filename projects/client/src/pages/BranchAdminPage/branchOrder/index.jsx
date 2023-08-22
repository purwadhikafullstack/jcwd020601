import { Box, Flex } from "@chakra-ui/react";
// import NavbarFooter from "../NavbarFooter";
// import Sidebar from "../Sidebar";
// import Navbar from "../Navbar";
import { useEffect, useState } from "react";
import { api } from "../../../api/api";

export default function BranchOrder() {
  const [trans, setTrans] = useState();

  // GET
  async function fetch() {
    const result = await api().post("/order/branch", {
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
      <Box
        marginLeft={60}
        marginTop={"6em"}
        h={"80vh"}
        // bgColor={"red"}
        overflow={"auto"}
      ></Box>
      {/* <Flex marginLeft={60} marginTop={20}> */}
      {/* <Sidebar /> */}
      {/* <Box
          display={"flex"}
          flexDirection={"column"}
          width={"100%"}
          marginLeft={50}
        > */}
      {/* <Navbar /> */}
      {/* <h1>adsdas</h1>
          {/* transaction on branch */}
      {/* {trans?.map((val) => {
            return (
              <Flex height={"100px"} width={"100px"}>
                {val.total}
              </Flex>
            );
          })} */}
      {/* <Flex bgColor={"red"} height={"100px"} width={"100px"}></Flex> */}
      {/* <Flex>
            <Flex></Flex>
          </Flex> */}
      {/* <NavbarFooter /> */}
      {/* </Box>
      </Flex> */}
    </>
  );
}
