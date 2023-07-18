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
import { AiTwotoneDelete } from "react-icons/ai";
import { IoStorefrontSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import Increment from "../components/Increment";
import DeleteModal from "../components/DeleteCart";
import { api } from "../api/api";

export default function CartPage() {
  const [edit, setEdit] = useState(false);
  const [cart, setCart] = useState();

  useEffect(() => {
    async function fetch() {
      await api.get("cart").then((res) => {
        return setCart(res.data);
      });
    }
    fetch();
  }, []);

  console.log(cart);

  return (
    <Container maxW={"size.lg"}>
      <Navbar></Navbar>
      <Box>
        <Box padding={"1rem 2rem"} fontSize={"2xl"} fontWeight={"semibold"}>
          Cart
        </Box>
        <Flex>
          <Flex
            width={"65%"}
            flexDir={"column"}
            gap={"1rem"}
            padding={" 1rem 2rem"}
          >
            <Flex
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
            </Flex>
            <Flex
              flexDir={"column"}
              boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
              borderRadius={"0.7rem"}
            >
              <Flex padding={"1rem"}>
                <Box textAlign={"center"} width={"20%"} fontWeight={"semibold"}>
                  Order 1
                </Box>
                <Flex alignItems={"center"} gap={"0.3rem"}>
                  <Icon as={IoStorefrontSharp}></Icon>
                  <Box>Gramedia Official - Gramedia Bandung Merdeka</Box>
                </Flex>
              </Flex>
              <Flex
                justifyContent={"space-between"}
                alignItems={"center"}
                padding={"1rem 2rem"}
              >
                <Image src="https://cdn.gramedia.com/uploads/items/9786028759427_Logika-Algoritma-dan-Pemrograman-Dasar__w82_hauto.jpg"></Image>
                <Flex
                  w={"45%"}
                  flexDir={"column"}
                  justifyContent={"space-evenly"}
                >
                  <Box>Logika Algoritma dan Pemrograman Dasar</Box>
                  <Box>Soft Cover - 1 Barang (0.85 kg)</Box>
                  <Box>Rp 180.000</Box>
                </Flex>
                {/* seperate */}
                <Increment></Increment>
                {/* {cart.quantity} */}
                {/* seperate */}
                <Flex flexDir={"column"} gap={"8px"}>
                  <Box>Rp 180.000</Box>
                  <Flex alignItems={"center"}>
                    <Icon as={AiTwotoneDelete}></Icon>
                    {/* <Box>delete</Box> */}
                    <DeleteModal />
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                textAlign={"center"}
                padding={"1rem 2rem"}
                fontWeight={"semibold"}
              >
                <Box w={"50%"}>total</Box>
                <Box w={"50%"}>RP 180.000</Box>
              </Flex>
            </Flex>
          </Flex>
          <Box width={"35%"} padding={"1rem 2rem"}>
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
                    RP 180.000
                  </Box>
                </Flex>
                <Button
                  colorScheme={"blue"}
                  borderRadius={"1.5rem"}
                  width={"100%"}
                >
                  Proceed to Payment
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Container>
  );
}
