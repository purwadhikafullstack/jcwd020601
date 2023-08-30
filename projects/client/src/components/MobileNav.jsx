import {
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  Icon,
  Collapse,
  InputGroup,
  Input,
  InputRightElement,
  Text,
  useColorModeValue,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { BsChevronDown, BsCart } from "react-icons/bs";
import { GoSearch } from "react-icons/go";
import { api } from "../api/api";
import logo from "../assets/images/gramedia-icon-2.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function MobileNav({
  category,

  modalSelectAddress,
  location,
}) {
  const nav = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const userSelector = useSelector((state) => state.login.auth);
  const [result, setResult] = useState([]);
  const [input, setInput] = useState("");
  const orderSelector = useSelector((state) => state.login.order);
  const NAV_ITEMS = [
    {
      label: "Kategori",
      children: category,
      href: "#",
    },
    {
      label: userSelector.address
        ? "Location / Change Location (" + userSelector?.address?.city + ")"
        : "Location / Change Location",
      onOpen: modalSelectAddress.onOpen,
      display: location == "profile" || location == "orders" ? "none" : "block",
    },

    {
      label: "My Orders",
      href: `/orders`,
    },
    {
      label: "My Profile",
      href: `/profile`,
    },
    {
      label: userSelector.email ? "Logout" : "Login",
      href: "/login",
      onClick: "logout",
    },
    {
      display: userSelector.email ? "none" : "block",
      label: "Registrasi",
      href: `/Register`,
    },
  ];

  const fetchData = async (value) => {
    try {
      const response = await api().get(
        `/stock?place=${orderSelector.BranchId}`
      );
      const json = await response.data.result;
      const result = json.filter((stock) => {
        return (
          value &&
          stock.Book &&
          stock.Book.title &&
          stock.Book.title.toLowerCase().includes(value.toLowerCase())
        );
      });

      setResult(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };
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
              bg={useColorModeValue("white", "gray.800")}
              color={useColorModeValue("gray.600", "white")}
              minH={"60px"}
              py={{ base: 2 }}
              px={{ base: 2 }}
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
              >
                {NAV_ITEMS.map((navItem) => (
                  <MobileNavItem
                    location={location}
                    key={navItem.label}
                    {...navItem}
                  />
                ))}
              </Stack>
            </Collapse>
          </Box>
        </Box>
        <Box
          display={"flex"}
          w={{ base: "15em", sm: "30em" }}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          h={"60px"}
          onClick={() => nav("/")}
          cursor={"pointer"}
        >
          <Image src={logo} w={{ base: "10em", sm: "12em" }} />
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          h={"60px"}
        >
          <Box>
            <Menu>
              <MenuButton onClick={() => nav("/cart")}>
                <Flex alignItems={"center"} gap={"0.1rem"}>
                  <Icon
                    as={BsCart}
                    w={{ base: "5em", sm: "5em" }}
                    h={{ base: 8, sm: 10 }}
                    color="blue.700"
                    cursor={"pointer"}
                  />
                </Flex>
              </MenuButton>
            </Menu>
          </Box>
        </Box>
      </Box>

      <Box
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
      </Box>
    </>
  );
}

const MobileNavItem = ({
  label,
  children,
  href,
  display,
  onOpen,
  onClick,
  blocked,
  location,
}) => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  async function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("address");
    localStorage.removeItem("Latitude");
    localStorage.removeItem("Longitude");
    dispatch({
      type: "logout",
    });
    nav("/login");
    return;
  }
  const userSelector = useSelector((state) => state.login.auth);
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Stack spacing={4} onClick={children && onToggle} display={display}>
      <Flex
        display={
          blocked && (location == "profile" || location == "orders")
            ? "none"
            : "block"
        }
        py={2}
        as={Link}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
        onClick={
          userSelector.email && onClick == "logout"
            ? logout
            : onOpen
            ? onOpen
            : ""
        }
      >
        <Link to={href ? `${href}` : ""}>
          <Box
            fontWeight={600}
            color={useColorModeValue("gray.600", "gray.200")}
          >
            {label}
          </Box>
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
      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link
                key={child.label}
                py={2}
                to={`/products/filter/${child.id}`}
              >
                {child.category}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
