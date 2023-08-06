import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import CartBooks from "../components/CartBooks";
import { useNavigate } from "react-router-dom";
import Shipping from "../components/Shipping";
import { useSelector } from "react-redux";
// import { useSelector } from "react-redux";

export default function CartPage() {
  // const userSelector = useSelector((state) => state.login.auth);
  const orderSelector = useSelector((state) => state.login.order);
  const nav = useNavigate();
  const [edit, setEdit] = useState(false);
  const [total, setTotal] = useState(0);

  return (
    <Container maxW={"size.lg"}>
      <Navbar></Navbar>
      <Box>
        <Box padding={"1rem 2rem"} fontSize={"2xl"} fontWeight={"semibold"}>
          Cart
        </Box>
        <Flex flexWrap={"wrap"}>
          <Flex
            width={"65%"}
            flexDir={"column"}
            gap={"1rem"}
            padding={" 1rem 2rem"}
          >
            <CartBooks setTotal={setTotal}></CartBooks>
          </Flex>
          <Flex
            width={"35%"}
            flexDir={"column"}
            gap={"1rem"}
            padding={"1rem 2rem"}
          >
            {/* Shipping */}
            <Shipping total={total}></Shipping>
            {/* Shipping */}
            <Flex
              flexDir={"column"}
              boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
              borderRadius={"0.7rem"}
            >
              <Box padding={"2rem"} fontSize={"xl"} fontWeight={"semibold"}>
                Order Details
              </Box>
              <Flex
                flexDir={"column"}
                // justifyContent={"center"}
                alignItems={"center"}
                padding={"2rem"}
                gap={"2rem"}
                fontWeight={"semibold"}
              >
                <Flex gap={"1rem"}>
                  <Box>Payment Summary</Box>
                  <Box color={"blue.500"} fontWeight={"bold"}>
                    Rp {total.toLocaleString("id-ID")},-
                  </Box>
                </Flex>
                <Button
                  colorScheme={"blue"}
                  borderRadius={"1.5rem"}
                  width={"100%"}
                  onClick={() => nav("/order")}
                  isDisabled={true}
                  // onClick={() => console.log(orderSelector)}
                >
                  Create Order
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
}

{
  /* <Flex
              boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
              padding={"1rem 2rem"}
              borderRadius={"0.7rem"}
              justifyContent={"end"}
            >
              {edit ? (
                <Flex
                  justifyContent={"space-between"}
                  width={"100%"}
                  alignItems={"center"}
                >
                  <Flex alignItems={"center"} gap={"0.3rem"}>
                    <input
                      style={{ width: "1.2rem", height: "1.2rem" }}
                      type={"checkbox"}
                    />
                    <Box>Select All</Box>
                  </Flex>
                  <Flex gap={"6px"}>
                    <Button>Delete</Button>
                    <Button
                      colorScheme={"blue"}
                      onClick={() => {
                        setEdit(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </Flex>
              ) : (
                <Box
                  fontWeight={"semibold"}
                  cursor={"pointer"}
                  _hover={{ color: "blue.400" }}
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  Edit Cart
                </Box>
              )}
            </Flex> */
}
