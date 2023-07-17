import {
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Container,
  Icon,
  Grid,
  GridItem,
  InputGroup,
  Input,
  InputRightElement,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { BsChevronDown, BsCart } from "react-icons/bs";
import { GoSearch } from "react-icons/go";
import logo from "../assets/images/gramedia-icon-2.png";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";
import { useEffect } from "react";

export default function Navbar() {
  const userSelector = useSelector((state) => state.login.auth);
  const dispatch = useDispatch();
  async function logout() {
    window.location.reload();
    localStorage.removeItem("auth");
    dispatch({
      type: "logout",
    });
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
  useEffect(() => {
    console.log(userSelector.username);
  }, []);
  return (
    <Flex justifyContent={"space-around"} alignItems={"center"} height={"65px"}>
      <Box>
        <Image src={logo}></Image>
      </Box>
      <Box>
        <Menu>
          <MenuButton>
            <Flex alignItems={"center"} gap={"1rem"}>
              Category
              <Icon as={BsChevronDown}></Icon>
            </Flex>
          </MenuButton>
          <MenuList>
            <Container maxW={"size.lg"}>
              <Flex w={"100vw"}>
                <Flex flexDir={"column"} width={"30%"} fontWeight={"semibold"}>
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
                <Box width={"70%"}>
                  <Grid
                    // templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(2, 1fr)"
                    gap={3}
                  >
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
            </Container>

            {/* <MenuItem>New File</MenuItem> */}
          </MenuList>
        </Menu>
      </Box>
      <Box>
        <InputGroup>
          <InputRightElement pointerEvents="auto">
            <Icon
              cursor={"pointer"}
              _hover={{ color: "blue.400" }}
              as={GoSearch}
            ></Icon>
          </InputRightElement>
          <Input
            type="text"
            border={"none"}
            borderBottom={"1px solid #cccc"}
            placeholder="Search Book or Author"
            borderRadius={"0"}
            focusBorderColor="transparent"
            _focus={{ borderBottom: "1.6px solid grey" }}
          />
        </InputGroup>
      </Box>
      <Box>
        <Menu>
          <MenuButton>
            <Flex alignItems={"center"} gap={"0.1rem"} cursor={"pointer"}>
              <Avatar></Avatar>
            </Flex>
          </MenuButton>
          <MenuList>
            <Flex padding={"0 0.5rem"} flexDir={"column"} gap={"0.4rem"}>
              <Flex
                gap={"1rem"}
                justifyContent={"center"}
                flexDir={"column"}
                alignItems={"center"}
              >
                Halo, {userSelector.username}
                <MenuItem>Full Name</MenuItem>
                <MenuItem>Address</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
                <MenuItem onClick={verify}>Verify Account</MenuItem>
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
              <Icon as={BsCart}></Icon>
            </Flex>
          </MenuButton>
          <MenuList>
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
    </Flex>
  );
}
