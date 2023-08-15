import { Box, Flex, Image } from "@chakra-ui/react";

export default function Pending() {
  return (
    <>
      <Flex w={"100%"} mt={"20px"}>
        <Flex gap={"30px"} flexDir={"column"} w={"100%"}>
          <Flex
            _hover={{ bgColor: "#c7c7c7", cursor: "pointer" }}
            bgColor={"#f5f5f5"}
            w={"100%"}
            p={"10px"}
            border={"#c4c4c4 2px solid"}
          >
            <Flex w={"100%"} bgColor={"white"}>
              <Flex flexDir={"column"} w={"100%"} p={"10px"} gap={"10px"}>
                <Flex gap={"10px"}>
                  <Flex border={"3px solid #385898"}>
                    <Flex h={"100px"} w={"100px"} bgColor={"red"}></Flex>
                  </Flex>
                  <Flex flexDir={"column"} w={"70%"}>
                    <Flex
                      fontWeight={600}
                      fontSize={"1.1rem"}
                      color={"#385898"}
                      borderY={"1px solid #c4c4c4"}
                    >
                      Nama Product
                    </Flex>
                    <Flex justifyContent={"space-between"} w={"100%"}>
                      <Box>Author Buku</Box>
                      <Box>Qty : 3</Box>
                    </Flex>
                    <Flex color={"#8f8d8d"}>Rp.30.000</Flex>
                    <Flex justifyContent={"space-between"}>
                      <Flex fontWeight={"600"} color={"#ffb405"}>
                        Pending
                      </Flex>
                      <Flex fontWeight={500} color={"#8f8d8d"}>
                        2023/12/12
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  borderY={"1px solid #c4c4c4"}
                  justifyContent={"space-between"}
                  w={"100%"}
                  color={"#385898"}
                  fontWeight={"500"}
                >
                  <Flex>1 item</Flex>
                  <Flex>Total : Rp.90.000</Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        {/* <Center w={"100%"} flexDir={"column"}>
          <Center fontSize={"1.2rem"} color={"#0060ae"} fontWeight={600}>
            There Are No Orders Here
          </Center>
          <Center color={"#0095d8"}>Your Orders Would Go Here</Center>
        </Center> */}
      </Flex>
    </>
  );
}
