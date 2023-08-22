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
  ModalOverlay,
  ModalContent,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  useToast,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
// import { , useNavigate } from "react-router-dom";
import { BsChevronDown, BsCart } from "react-icons/bs";
import { GoSearch } from "react-icons/go";
import { api } from "../api/api";
import logo from "../assets/images/gramedia-icon-2.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdClose } from "react-icons/md";

import ModalSelectAddress from "../pages/ProfilePage/ModalSelectAddress";

export default function Navbar({ callback, keyword }) {
  const orderSelector = useSelector((state) => state.login.order);
  const userSelector = useSelector((state) => state.login.auth);
  const [large] = useMediaQuery("(min-width: 768px)");
  const [category, setCategory] = useState([]);
  const nav = useNavigate();

  const fetchCategori = async () => {
    let response = await api().get(`/category`);
    setCategory(response.data.result);
  };

  useEffect(() => {
    fetchCategori();
  }, [keyword]);
  return (
    <>
      <Box
        justifyContent={"center"}
        alignItems={"center"}
        display={"flex"}
        flexDirection={{
          base: "column",
          sm: "column",
          md: "row",
          lg: "row",
          xl: "row",
        }}
        height={
          large
            ? { base: "170px", sm: "170px", md: "85px" }
            : { base: "50px", sm: "50px" }
        }
        boxShadow="0 0 25px skyblue"
        position={"sticky"}
        top={0}
        width={"100%"}
        zIndex={1000}
        bg={{ base: "white", md: "white" }}
        py={large ? "0px" : "60px"}
      >
        {large ? (
          <DesktopNav
            callback={callback}
            keyword={keyword}
            category={category}
          />
        ) : (
          <MobileNav category={category} />
        )}
      </Box>
    </>
  );
}

function MobileNav({ category }) {
  const nav = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  // console.log({ ...category });
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
      label: "Keranjang",
      href: "/cart",
    },
    {
      label: "Masuk",
      href: `/login`,
    },
    {
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

      // console.log(result);
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
                // bgColor={"blue"}
                position={"absolute"}
                left={0}
                zIndex={10}
                width={"100%"}
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
                  {/* <Link to={`/cart`}> */}
                  <Icon
                    as={BsCart}
                    w={{ base: "5em", sm: "5em" }}
                    h={{ base: 8, sm: 10 }}
                    color="blue.700"
                    cursor={"pointer"}
                  />
                  {/* </Link> */}
                </Flex>
              </MenuButton>
              {/* <MenuList my={5} position={"fixed"} left={"-6em"}>
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
              </MenuList> */}
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

function DesktopNav({ callback, keyword, category }) {
  const toast = useToast();
  const locatio = useLocation();
  const location = locatio.pathname.split("/")[1];
  const userSelector = useSelector((state) => state.login.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [userAddresses, setUserAddresses] = useState([]);
  const [userAddress, setUserAddress] = useState([]);
  const [trans, setTrans] = useState(true);
  const modalSelectAddress = useDisclosure();
  // const [keyword, setkeyword] = useState("");
  const [value, setValue] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState("");
  const [result, setResult] = useState([]);
  const orderSelector = useSelector((state) => state.login.order);
  useEffect(() => {
    if (userSelector.email) {
      fetchUserAddresses();
      setUserAddress(userSelector.address);
      // fetchUserMainAddress();
    }
  }, []);
  function handleTrans() {
    setTrans(!trans);
  }
  async function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("address");
    localStorage.removeItem("Latitude");
    localStorage.removeItem("Longitude");
    await dispatch({
      type: "logout",
    });
    nav("/login");
    return;
  }
  async function login() {
    nav("/login");
    return;
  }
  async function fetchUserAddresses() {
    try {
      await api()
        .get("/address/user/" + userSelector.id)
        .then((res) => {
          setUserAddresses(res.data);
          // console.log(res.data);
        })
        .catch((err) => {
          toast({
            position: "top",
            title: "Something went a",
            description: err.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } catch (err) {
      alert(err.data.message);
    }
  }
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

      // console.log(result);
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
      <Box
        display={"flex"}
        w={{ sm: "10em", md: "15em", lg: "20em" }}
        alignItems={"center"}
        justifyContent={"space-evenly"}
        h={"60px"}
        // py={"50px"}
      >
        <Image
          src={logo}
          cursor={"pointer"}
          onClick={() => {
            nav("/");
          }}
        />
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
              my={"19px"}
              w={{
                base: "0",
                sm: "0",
                md: "48em",
                lg: "70em",
                xl: "93em",
              }}
              position={"fixed"}
              left={{
                base: "0",
                sm: "0",
                md: "-12em",
                lg: "-15em",
                xl: "-20em",
              }}
              boxShadow="0px 5px 10px skyblue"
            >
              <Flex justifyContent={"space-between"}>
                <Flex
                  flexDir={"column"}
                  fontSize={"xl"}
                  borderRightColor={"blue.700"}
                  pr={"20px"}
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
                  {category.map((val) => (
                    <Text
                      key={val.id}
                      cursor={"pointer"}
                      w={"15em"}
                      p={"10px"}
                      pl={"30px"}
                      _hover={{ bgColor: "#BEE3F8", color: "#2C5282" }}
                    >
                      {val.category}
                    </Text>
                  ))}
                </Flex>
                <Box>
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}></Grid>
                </Box>
              </Flex>
            </MenuList>
          </Menu>
        </Box>
        <Box display={"flex"} flexDirection={"column"}>
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
              // value={keyword}
              // onChange={callback}
              value={input}
              onChange={(e) => handleChange(e.target.value)}
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
          <Box
            bgColor={"white"}
            position={"absolute"}
            top={"85px"}
            w={{ md: "15em", lg: "30em" }}
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
        <Center h={"60px"} ml={"30px"}>
          <Flex
            px={"10px"}
            w={"150px"}
            cursor={"pointer"}
            h={"45px"}
            alignItems={"center"}
            gap={"0px"}
            border={"#d6d6d6 solid 2px"}
            borderRadius={"50px"}
            display={
              location == "profile" || location == "orders"
                ? "none"
                : "inline-flex"
            }
            onClick={() => {
              modalSelectAddress.onOpen();
            }}
          >
            <Flex>
              <Icon
                color={"green"}
                fontSize={"30px"}
                as={HiOutlineLocationMarker}
              ></Icon>
            </Flex>
            <Flex
              fontWeight={"700"}
              color="#2c5282"
              fontSize={
                userSelector?.address?.city?.length >= 16
                  ? "0.6rem"
                  : userSelector?.address?.city?.length >= 12
                  ? "0.8rem"
                  : "1rem"
              }
            >
              {userSelector?.address?.city || "Location"}
            </Flex>
          </Flex>
        </Center>
        <Modal
          closeOnOverlayClick={false}
          scrollBehavior="inside"
          isOpen={modalSelectAddress.isOpen}
          onClose={modalSelectAddress.onClose}
          isCentered
        >
          <ModalOverlay />
          <ModalContent maxH={"500px"} maxW="500px">
            <ModalHeader
              bgColor={"#385898"}
              color={"white"}
              w={"100%"}
              px={"10px"}
              display={"flex"}
              flexDir={"row"}
              justifyContent={"center"}
            >
              <Center fontWeight={700}>Select Address</Center>
              <Flex w={"70%"} flexDir={"row-reverse"}>
                <Button
                  w={"30px"}
                  onClick={() => {
                    modalSelectAddress.onClose();
                  }}
                >
                  <Icon fontSize={"30px"} as={MdClose}></Icon>
                </Button>
              </Flex>
            </ModalHeader>

            <ModalBody maxW="500px" py={"20px"}>
              {userAddresses[0] ? (
                <Flex flexDir={"column"} gap={"20px"} pr={"50px"}>
                  {userAddresses.map((val) => {
                    return (
                      <>
                        <ModalSelectAddress
                          userSelector={userSelector}
                          modalSelectAddress={modalSelectAddress}
                          userAddress={userAddress}
                          setUserAddress={setUserAddress}
                          address={val}
                          id={val.id}
                          province={val.province}
                          city={val.city}
                          pos={val.pos}
                          labelAlamat={val.labelAlamat}
                          isMain={val.isMain}
                          no_Handphone={val.no_Handphone}
                          alamatLengkap={val.alamatLengkap}
                          namaPenerima={val.namaPenerima}
                        />
                      </>
                    );
                  })}
                </Flex>
              ) : (
                <Center
                  flexDir={"column"}
                  w={"100%"}
                  pt={"20px"}
                  pb={"40px"}
                  gap={"30px"}
                >
                  <Flex
                    color={"#b3b4ba"}
                    fontSize={"1.4rem"}
                    fontWeight={"600"}
                  >
                    You Have No Addresses To Pick From
                  </Flex>
                  {userSelector.username ? (
                    <Button
                      bgColor={"#385898"}
                      color={"white"}
                      _hover={{ cursor: "pointer", color: "#32aced" }}
                      onClick={() => nav("/profile")}
                      fontSize={"1.4rem"}
                      fontWeight={"600"}
                    >
                      Create One
                    </Button>
                  ) : (
                    <Button
                      bgColor={"#385898"}
                      color={"white"}
                      _hover={{ cursor: "pointer", color: "#32aced" }}
                      onClick={() => nav("/login")}
                      fontSize={"1.4rem"}
                      fontWeight={"600"}
                    >
                      Require Login
                    </Button>
                  )}
                </Center>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
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
            <MenuButton onClick={() => nav("/cart")}>
              <Flex alignItems={"center"} gap={"0.1rem"} cursor={"pointer"}>
                <Icon as={BsCart} w={10} h={10} color="blue.700"></Icon>
              </Flex>
            </MenuButton>
          </Menu>
        </Box>
        <Box>
          <Menu>
            <MenuButton>
              <Flex alignItems={"center"} gap={"0.1rem"} cursor={"pointer"}>
                <Image
                  w={"50px"}
                  h="50px"
                  borderRadius="full"
                  objectFit={"fill"}
                  border={"2px #0060ae solid"}
                  src={
                    userSelector.avatar_url
                      ? userSelector.avatar_url
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT19eLyqRHQDO-VnXj1HhzL_9q8yHF-3ewIhA&usqp=CAU"
                  }
                ></Image>
              </Flex>
            </MenuButton>
            <MenuList
              my={"12px"}
              position={"fixed"}
              left={"-6em"}
              // bgColor={"pink.100"}
              p={0}
            >
              <Flex flexDir={"column"}>
                <Text
                  onClick={() => nav("/profile")}
                  cursor={"pointer"}
                  _hover={{ bgColor: "#BEE3F8", color: "#2C5282" }}
                  p={3}
                >
                  My Account
                </Text>
                <Text
                  onClick={() => nav("/orders")}
                  cursor={"pointer"}
                  _hover={{ bgColor: "#BEE3F8", color: "#2C5282" }}
                  p={3}
                >
                  My Orders
                </Text>
                <Text _hover={{ bgColor: "#BEE3F8", color: "#2C5282" }} p={3}>
                  My Wishlist
                </Text>
                <Text
                  onClick={userSelector.email ? logout : login}
                  _hover={{ bgColor: "#BEE3F8", color: "#2C5282" }}
                  p={3}
                  cursor={"pointer"}
                >
                  {userSelector.email ? "Logout" : "Login"}
                </Text>
              </Flex>
            </MenuList>
          </Menu>
        </Box>
      </Box>
    </>
  );
}

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();
  console.log(href);
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        // href={`${href}`}
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

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              // console.log(child.href);
              <Link key={child.label} py={2} to={`${child.href}`}>
                {child.category}
                {/* {child.href} */}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
