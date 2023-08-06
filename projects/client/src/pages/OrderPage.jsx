import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Center,
  Image,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineDown, AiOutlineBank } from "react-icons/ai";
// import { useEffect, useState } from "react";
import { api } from "../api/api";
// import CartBooks from "../components/CartBooks";
// import { useSelector } from "react-redux";

export default function OrderPage() {
  // const userSelector = useSelector((state) => state.login.auth);
  // const [edit, setEdit] = useState(false);
  // const [total, setTotal] = useState(0);

  return (
    <Container maxW={"size.lg"}>
      <Navbar></Navbar>
      <Box>
        <Box padding={"1rem 2rem"} fontSize={"2xl"} fontWeight={"semibold"}>
          OrderID: onfd8762cv
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
              flexDir={"column"}
              justifyContent={"center"}
              gap={"1rem"}
            >
              <Flex alignItems={"center"}>
                <Icon as={MdLocationOn}></Icon>
                Alamat Tujuan Pengiriman
              </Flex>
              <Flex flexDir={"column"}>
                <Box>
                  As a user, I want to select or change shipping method based on
                  my address
                </Box>
                <Menu>
                  <MenuButton
                    width={"-webkit-fit-content"}
                    // borderBottom={"1px solid"}
                    as={Button}
                    variant={"ghost"}
                    colorScheme="blue"
                  >
                    <Center>
                      <Icon as={AiOutlineDown}></Icon>
                      Select shipping method
                    </Center>
                  </MenuButton>
                  <MenuList>
                    <MenuItem>JNE</MenuItem>
                    <MenuItem>POS</MenuItem>
                    <MenuItem>TIKI</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>
            {/* <CartBooks setTotal={setTotal}></CartBooks> */}
          </Flex>
          <Flex width={"35%"} padding={"1rem 2rem"} flexDir={"column"}>
            <Flex
              boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
              padding={"1rem 2rem"}
              borderRadius={"0.7rem"}
              // justifyContent={"end"}
              flexDir={"column"}
            >
              <Flex>Complete the payment and uploud the payment proof</Flex>
              <Box>
                <Icon as={AiOutlineBank}></Icon> BCA 11223456789
              </Box>
            </Flex>
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
                    {/* {total.toLocaleString("id-ID")} */}
                  </Box>
                </Flex>
                <Button
                  colorScheme={"blue"}
                  borderRadius={"1.5rem"}
                  width={"100%"}
                >
                  Upload Payment Proof
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
}
