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
import { api } from "../../api/api";
import logo from "../../assets/images/gramedia-icon-2.png";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const [large] = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <Box
        justifyContent={"flex-end"}
        alignItems={"center"}
        display={"flex"}
        flexDirection={"row"}
        h={{ base: "6em" }}
        // top={0}
        // borderBottom="1px"
        zIndex={1}
        w={"100%"}
        position={"sticky"}
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        bg={"#2c5282"}
      >
        <DesktopNav />
      </Box>
    </>
  );
}

function DesktopNav() {
  const nav = useNavigate();
  const userSelector = useSelector((state) => state.login.auth);
  const dispatch = useDispatch();
  async function logout() {
    localStorage.removeItem("auth");
    dispatch({
      type: "logout",
    });
    nav("/adminlogin");
    return;
  }
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"center"}
        h={"60px"}
        marginRight={"100px"}
        alignItems={"center"}
        gap={5}
      >
        {" "}
        <Box>
          <Text color={"white"} fontSize={"1.3rem"}>
            Admin
          </Text>
        </Box>
        <Box cursor="pointer">
          <Menu>
            <MenuButton>
              <Flex alignItems={"center"} gap={"0.1rem"} cursor={"pointer"}>
                <Avatar border={"2px white solid"} w={45} h={45}></Avatar>
              </Flex>
            </MenuButton>
            <MenuList
              my={5}
              p={0}
              position={"fixed"}
              left={"-6em"}
              display={"flex"}
              flexDir={"column"}
            >
              <Box
                onClick={logout}
                cursor={"pointer"}
                w={"100%"}
                h={12}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                _hover={{ bgColor: "#BEE3F8", color: "#2C5282" }}
              >
                Logout
              </Box>
            </MenuList>
          </Menu>
        </Box>
      </Box>
    </>
  );
}
