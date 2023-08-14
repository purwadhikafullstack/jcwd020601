import { Box, Center, Flex, Image } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { api } from "../../../api/api";
import { useEffect, useState } from "react";
import moment from "moment";

export default function Pending() {
  const [pending, setPending] = useState([]);
  const userSelector = useSelector((state) => state.login.auth);
  async function fetchPending() {
    await api
      .get("/order/pending/" + userSelector.id)
      .then((res) => {
        setPending(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  useEffect(() => {
    fetchPending();
  }, []);
  return (
    <>
      <Flex w={"100%"} mt={"20px"} gap={"30px"} flexDir={"column"}>
        {pending[0] ? (
          pending.map((val) => (
            <Flex gap={"30px"} flexDir={"column"} w={"100%"}>
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
                          src={val.payment_url}
                          h={"100px"}
                          w={"100px"}
                          bgColor={"red"}
                        ></Image>
                      </Flex>
                      <Flex flexDir={"column"} w={"70%"}>
                        <Flex
                          fontWeight={600}
                          fontSize={"1.1rem"}
                          color={"#385898"}
                          borderY={"1px solid #c4c4c4"}
                        >
                          UUID
                        </Flex>

                        <Flex mt={"30px"} color={"#8f8d8d"}>
                          Rp.30.000
                        </Flex>
                        <Flex justifyContent={"space-between"}>
                          <Flex fontWeight={"600"} color={"#ffb405"}>
                            {val.status}
                          </Flex>
                          <Flex fontWeight={500} color={"#8f8d8d"}>
                            {moment(val.createdAt).format("LL")}
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
              <Center fontSize={"1.2rem"} color={"#0060ae"} fontWeight={600}>
                There Are No Orders Here
              </Center>
              <Center color={"#0095d8"}>Your Orders Would Go Here</Center>
            </Center>
          </>
        )}
      </Flex>
    </>
  );
}
