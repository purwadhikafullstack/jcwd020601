import {
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Container,
  Icon,
  Collapse,
  Grid,
  GridItem,
  InputGroup,
  Input,
  InputRightElement,
  Avatar,
  Center,
  Text,
  useMediaQuery,
  useColorModeValue,
  IconButton,
  Stack,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { BsChevronDown, BsCart } from "react-icons/bs";
import { GoSearch } from "react-icons/go";
import { api } from "../api/api";
import logo from "../assets/images/gramedia-icon-2.png";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const userSelector = useSelector((state) => state.login.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [trans, setTrans] = useState(true);
  function handleTrans() {
    setTrans(!trans);
  }
  async function logout() {
    window.location.reload();
    localStorage.removeItem("auth");
    dispatch({
      type: "logout",
    });
    return;
  }
  async function login() {
    nav("/login");
    return;
  }
  async function verify() {
    await api
      .get("auth/generate-token/emailverify", {
        params: {
          email: userSelector.email,
        },
      })
      .then(
        (res) => alert(res.data.message)
        // /forgot-password/token
        //    console.log(res.data));
      );
  }
  return (
    <>
      <Flex pt={"10px"} pb={"10px"}>
        <Box
          display={"flex"}
          w={{ sm: "10em", md: "15em", lg: "20em" }}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          h={"60px"}
          // py={"50px"}
        >
          <Image src={logo} />
        </Box>
        <Box
          display={"flex"}
          w={{ md: "660px", lg: "860px" }}
          justifyContent={"space-evenly"}
          alignItems={"center"}
          h={"60px"}
        >
          <Box>
            <Menu>
              <MenuButton onClick={handleTrans}>
                <Flex alignItems={"center"} gap={"1rem"}>
                  <Text
                    fontWeight={"bold"}
                    fontSize={{ sm: "md", md: "xl" }}
                    color={"blue.700"}
                  >
                    Kategori
                  </Text>
                  <Icon
                    as={BsChevronDown}
                    style={
                      trans
                        ? {
                            color: "blue",
                            fontSize: "25px",
                            transform: "rotate(0deg)",
                            transition: "transform 150ms ease",
                          }
                        : {
                            color: "blue",
                            fontSize: "25px",
                            transform: "rotate(180deg)",
                            transition: "transform 150ms ease",
                          }
                    }
                  />
                </Flex>
              </MenuButton>
              <MenuList
                my={5}
                // "1500px"
                w={{
                  base: "0",
                  sm: "0",
                  md: "48em",
                  lg: "70em",
                  xl: "93em",
                }}
                position={"fixed"}
                // "-25em"
                left={{
                  base: "0",
                  sm: "0",
                  md: "-12em",
                  lg: "-15em",
                  xl: "-25em",
                }}
                p={"30px"}
              >
                <Flex justifyContent={"space-between"}>
                  <Flex
                    flexDir={"column"}
                    fontWeight={"semibold"}
                    gap={4}
                    fontSize={"xl"}
                    borderRight={"1px"}
                    borderRightColor={"blue.700"}
                    pr={"20px"}
                  >
                    <Box cursor={"pointer"} _hover={{ color: "blue.400" }}>
                      International
                    </Box>
                    <Box cursor={"pointer"} _hover={{ color: "blue.400" }}>
                      Novel
                    </Box>
                    <Box cursor={"pointer"} _hover={{ color: "blue.400" }}>
                      History
                    </Box>
                    <Box cursor={"pointer"} _hover={{ color: "blue.400" }}>
                      Comic
                    </Box>
                    <Box cursor={"pointer"} _hover={{ color: "blue.400" }}>
                      Self Improvement
                    </Box>
                    <Box cursor={"pointer"} _hover={{ color: "blue.400" }}>
                      Engineering
                    </Box>
                  </Flex>
                  <Box>
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem>category 1</GridItem>
                      <GridItem>category 2</GridItem>
                      <GridItem>category 3</GridItem>
                      <GridItem>category 4</GridItem>
                      <GridItem>category 5</GridItem>
                      <GridItem>category 6</GridItem>
                      <GridItem>category 7</GridItem>
                      <GridItem>category 8</GridItem>
                    </Grid>
                  </Box>
                </Flex>
              </MenuList>
            </Menu>
          </Box>
          <Box>
            <InputGroup>
              <InputRightElement pointerEvents="auto">
                <Icon
                  cursor={"pointer"}
                  _hover={{ color: "blue.800" }}
                  as={GoSearch}
                  color="blue.700"
                ></Icon>
              </InputRightElement>
              <Input
                type="text"
                border={"none"}
                borderBottom={"1px solid #cccc"}
                placeholder="Search Book or Author"
                color="blue.700"
                borderRadius={"0"}
                style={{
                  placeholder: {
                    color: "red.700",
                  },
                }}
                w={{ md: "15em", lg: "30em" }}
                focusBorderColor="transparent"
                _focus={{ borderBottom: "1.6px solid grey" }}
              />
            </InputGroup>
          </Box>
        </Box>
        <Box
          display={"flex"}
          w={{ sm: "10em", md: "15em", lg: "20em" }}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          h={"60px"}
          // bgColor={"green"}
        >
          <Box>
            <Menu>
              <MenuButton>
                <Flex alignItems={"center"} gap={"0.1rem"} cursor={"pointer"}>
                  <Icon as={BsCart} w={10} h={10} color="blue.700"></Icon>
                </Flex>
              </MenuButton>
              <MenuList my={5} position={"fixed"} left={"-6em"}>
                <Flex padding={"0 0.5rem"} flexDir={"column"} gap={"0.4rem"}>
                  <Flex
                    gap={"1rem"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDir={"column"}
                  >
                    <Box>Cart</Box>
                    <Box>Total</Box>
                  </Flex>
                  <Center
                    bgColor={"blue.400"}
                    cursor={"pointer"}
                    _hover={{
                      opacity: "0.9",
                    }}
                  >
                    Full Profile
                  </Center>
                </Flex>
              </MenuList>
            </Menu>
          </Box>
          <Box>
            <Menu>
              <MenuButton>
                <Flex alignItems={"center"} gap={"0.1rem"} cursor={"pointer"}>
                  <Avatar w={10} h={10}></Avatar>
                </Flex>
              </MenuButton>
              <MenuList my={5} position={"fixed"} left={"-6em"}>
                <Flex padding={"0 0.5rem"} flexDir={"column"} gap={"0.4rem"}>
                  <Flex
                    gap={"1rem"}
                    justifyContent={"center"}
                    flexDir={"column"}
                    alignItems={"center"}
                    onClick={nav("/Profile")}
                  >
                    Profile
                    <Box>Full Name</Box>
                    <Box>Address</Box>
                    <Box onClick={userSelector.email ? logout : login}>
                      {userSelector.email ? "Logout" : "Login"}
                    </Box>
                    <Box onClick={verify}>Verify Account</Box>
                  </Flex>
                </Flex>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Flex>
    </>
  );
}
