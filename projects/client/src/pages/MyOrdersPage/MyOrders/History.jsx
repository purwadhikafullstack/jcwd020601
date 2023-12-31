import { Box, Center, Flex, Image } from "@chakra-ui/react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function History(props) {
  const nav = useNavigate();

  return (
    <>
      <Flex
        mb={{ base: "100px", sm: "100px", md: "100px" }}
        w={"100%"}
        mt={"20px"}
        gap={"30px"}
        flexDir={"column"}
      >
        {props.history[0] ? (
          props.history.map((val) => (
            <Flex
              gap={"30px"}
              flexDir={"column"}
              w={"100%"}
              onClick={() => nav("/order/" + val.invoiceCode)}
            >
              <Flex
                _hover={{ bgColor: "#c7c7c7", cursor: "pointer" }}
                bgColor={"#f5f5f5"}
                w={"100%"}
                p={"10px"}
                border={"#c4c4c4 2px solid"}
              >
                <Flex w={"100%"} bgColor={"#f5f5f5"}>
                  <Flex flexDir={"column"} w={"100%"} p={"10px"} gap={"10px"}>
                    <Flex gap={"10px"}>
                      <Flex border={"3px solid #385898"}>
                        <Image
                          src={
                            process.env.REACT_APP_API_IMAGE_URL +
                            val.payment_url
                          }
                          h={"100px"}
                          w={"100px"}
                        ></Image>
                      </Flex>
                      <Flex flexDir={"column"} w={"70%"}>
                        <Flex
                          justifyContent={"space-between"}
                          borderY={"1px solid #c4c4c4"}
                        >
                          <Flex
                            fontWeight={600}
                            fontSize={"1.1rem"}
                            color={"#385898"}
                          >
                            {val.invoiceCode}
                          </Flex>
                          <Flex fontWeight={500} color={"#8f8d8d"}>
                            {moment(val.createdAt).format("LL")}
                          </Flex>
                        </Flex>
                        <Flex fontWeight={"600"}>
                          {val.Address?.labelAlamat +
                            " (" +
                            val.Address?.city +
                            ")"}
                        </Flex>

                        <Flex fontWeight={"600"} color={"#ffb405"}>
                          {val.status.charAt(0).toUpperCase() +
                            val.status.slice(1)}
                        </Flex>

                        <Flex fontWeight={500} color={"#8f8d8d"}>
                          {moment(val.createdAt, "YYYYMMDD").fromNow()}
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
                      <Flex>
                        Total : Rp.{val.total.toLocaleString("id-ID")}
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          ))
        ) : (
          <>
            <Center w={"100%"} flexDir={"column"}>
              <Center fontSize={"1.3rem"} color={"#0060ae"} fontWeight={600}>
                There Are No Orders Here
              </Center>
              <Center fontSize={"1.1rem"} color={"#0095d8"}>
                Your Orders Would Go Here
              </Center>
            </Center>
          </>
        )}
      </Flex>
    </>
  );
}
