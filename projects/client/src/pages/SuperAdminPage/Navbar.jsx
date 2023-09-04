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
import { api } from "../../api/api";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  // const [large] = useMediaQuery("(min-width: 768px)");
  const [large] = useMediaQuery("(min-width: 992px)");

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
        {large ? (
          <>
            <DesktopNav />
          </>
        ) : (
          <>
            <MobileNav />
          </>
        )}
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
        marginRight={{ base: "30px", lg: "100px" }}
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

function MobileNav() {
  const nav = useNavigate();
  const { isOpen, onToggle } = useDisclosure();

  const [result, setResult] = useState([]);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.login.auth);
  // const orderSelector = useSelector((state) => state.login.order);
  async function logout() {
    localStorage.removeItem("auth");
    dispatch({
      type: "logout",
    });
    nav("/adminlogin");
    return;
  }
  async function verify() {
    await api
      .get("auth/generate-token/emailverify", {
        params: {
          email: userSelector.email,
        },
      })
      .then((res) => alert(res.data.message));
  }
  const NAV_ITEMS = [
    {
      label: "Home",
      href: "/superadminpage",
    },
    {
      label: "Product",
      href: "/superadminpage/product",
    },
    {
      label: "Category",
      href: `/superadminpage/category`,
    },
    {
      label: "Transaction",
      href: `/superadminpage/order`,
    },
    {
      label: "Branch-Admins",
      href: `/superadminpage/branchadmin`,
      // click: verify,
    },
    {
      label: "Logout",
      href: `/adminlogin`,
      click: logout,
    },
  ];

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          h={"60px"}
        >
          <Box>
            <Flex
              // bg={useColorModeValue("white", "gray.800")}
              // color={useColorModeValue("gray.600", "white")}
              minH={"60px"}
              py={{ base: 2 }}
              px={{ base: 2 }}
              // bgColor={"red.100"}
              marginRight={"30px"}
            >
              <Flex>
                <IconButton
                  onClick={onToggle}
                  icon={
                    isOpen ? (
                      <CloseIcon w={5} h={5} />
                    ) : (
                      <HamburgerIcon w={8} h={8} />
                    )
                  }
                  variant={"ghost"}
                  aria-label={"Toggle Navigation"}
                />
              </Flex>
            </Flex>

            <Collapse in={isOpen}>
              <Stack
                bg={useColorModeValue("white", "gray.800")}
                p={4}
                position={"absolute"}
                left={0}
                zIndex={10}
                width={"100%"}
                h={"100vh"}
              >
                {NAV_ITEMS.map((navItem) => (
                  <MobileNavItem key={navItem.label} {...navItem} />
                ))}
              </Stack>
            </Collapse>
          </Box>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          h={"60px"}
        ></Box>
      </Box>
    </>
  );
}

const MobileNavItem = ({ label, children, href, click }) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        // as={Link}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Link to={`${href}`}>
          <Text
            fontWeight={600}
            color={useColorModeValue("gray.600", "gray.200")}
            onClick={click}
          >
            {label}
          </Text>
        </Link>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>
    </Stack>
  );
};
