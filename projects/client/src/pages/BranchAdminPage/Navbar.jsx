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
  // Link,
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
import { useNavigate, Link } from "react-router-dom";
// import { useLocation, useNavigate, Link } from "react-router-dom";
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
        // top={0}
        // position={"absolute"}
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
  async function verify() {
    await api
      .get("auth/generate-token/emailverify", {
        params: {
          email: userSelector.email,
        },
      })
      .then((res) => alert(res.data.message));
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
              left={{ base: "-10em", lg: "-6em" }}
              // bgColor={"yellow.100"}
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
              <Box
                onClick={verify}
                cursor={"pointer"}
                w={"100%"}
                h={12}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                _hover={{ bgColor: "#BEE3F8", color: "#2C5282" }}
              >
                Verify Account
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
  const orderSelector = useSelector((state) => state.login.order);
  const NAV_ITEMS = [
    {
      label: "Home",
      // children: category,
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
      {/* <Box
        display={"flex"}
        justifyContent={"space-evenly"}
        alignItems={"center"}
        h={"60px"}
      >
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
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              style={{
                placeholder: {
                  color: "red.700",
                },
              }}
              w={{ base: "22em", sm: "42em" }}
              focusBorderColor="transparent"
              _focus={{ borderBottom: "1.6px solid grey" }}
            />
          </InputGroup>
          <Box
            bgColor={"white"}
            position={"absolute"}
            top={"120px"}
            w={{ base: "22em", md: "15em", lg: "30em" }}
            boxShadow="0px 5px 10px skyblue"
            display={"flex"}
            flexDirection={"column"}
            gap={3}
            borderRadius={5}
            maxH={"200px"}
            overflowY={"scroll"}
            sx={{
              "&::-webkit-scrollbar": {
                width: "5px",
                borderRadius: "8px",
                backgroundColor: `rgba(0, 0, 0, 0.05)`,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: `#cce6ff`,
              },
            }}
          >
            {result.map((val) => (
              <Link to={`/products/detail/${val.id}`}>
                <Text
                  key={val.id}
                  p={3}
                  cursor={"pointer"}
                  _hover={{ bgColor: "#BEE3F8", color: "#2C5282" }}
                >
                  {val.Book?.title}
                </Text>
              </Link>
            ))}
          </Box>
        </Box>
      </Box> */}
    </>
  );
}

const MobileNavItem = ({ label, children, href }) => {
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

      {/* <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} to={`${child.href}`}>
                {child.category}
              </Link>
            ))}
        </Stack>
      </Collapse> */}
    </Stack>
  );
};
