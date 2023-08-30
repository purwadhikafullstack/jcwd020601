import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Collapse,
  Avatar,
  Text,
  useMediaQuery,
  useColorModeValue,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import MobileNavItem from "./MobileNavItem";
export default function Navbar() {
  const [large] = useMediaQuery("(min-width: 992px)");
  return (
    <>
      <Box
        justifyContent={"flex-end"}
        alignItems={"center"}
        display={"flex"}
        flexDirection={"row"}
        h={{ base: "6em" }}
        zIndex={1}
        w={"100%"}
        position={"sticky"}
        borderBottom="1px"
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
              left={{ base: "-10em", lg: "-6em" }}
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
  const dispatch = useDispatch();
  async function logout() {
    localStorage.removeItem("auth");
    dispatch({
      type: "logout",
    });
    nav("/adminlogin");
    return;
  }
  const NAV_ITEMS = [
    {
      label: "Home",
      href: "/admin",
    },
    {
      label: "Stock",
      href: "/admin/stock",
    },
    {
      label: "Discount",
      href: `/admin/discount`,
    },
    {
      label: "Transaction",
      href: `/admin/order`,
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
              minH={"60px"}
              py={{ base: 2 }}
              px={{ base: 2 }}
              marginRight={"30px"}
            >
              <Flex>
                <IconButton
                  onClick={onToggle}
                  icon={
                    isOpen ? (
                      <CloseIcon w={5} h={5} />
                    ) : (
                      <HamburgerIcon color={"white"} w={8} h={8} />
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
