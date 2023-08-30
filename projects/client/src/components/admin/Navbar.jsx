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
  ModalOverlay,
  ModalContent,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  useToast,
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
import logo from "../assets/images/gramedia-icon-2.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import ModalSelectAddress from "../ProfilePage/ModalSelectAddress";
export default function Navbar() {
  const [large] = useMediaQuery("(min-width: 768px)");
  const nav = useNavigate();
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
        {large ? <DesktopNav /> : <MobileNav />}
      </Box>
    </>
  );
}

function MobileNav() {
  const nav = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
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

            <Collapse in={isOpen} animateOpacity>
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
        >
          <Image src={logo} w={{ base: "10em", sm: "12em" }}></Image>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          h={"60px"}
        >
          <Box>
            <Menu>
              <MenuButton>
                <Flex alignItems={"center"} gap={"0.1rem"}>
                  <Icon
                    as={BsCart}
                    w={{ base: "5em", sm: "5em" }}
                    h={{ base: 8, sm: 10 }}
                    color="blue.700"
                    cursor={"pointer"}
                  ></Icon>
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
        </Box>
      </Box>
    </>
  );
}

function DesktopNav() {
  const locatio = useLocation();
  const toast = useToast();
  const location = locatio.pathname.split("/")[1];
  const userSelector = useSelector((state) => state.login.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [userAddresses, setUserAddresses] = useState([]);
  const [userAddress, setUserAddress] = useState([]);
  const [trans, setTrans] = useState(true);
  const modalSelectAddress = useDisclosure();
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
    dispatch({
      type: "logout",
    });
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
        })
        .catch((err) => {
          toast({
            position: "top",
            title: "Something went wrongsas",
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
        <Center h={"60px"} ml={"30px"}>
          <Flex
            px={"10px"}
            w={"150px"}
            cursor={"pointer"}
            h={"45px"}
            alignItems={"center"}
            gap={"5px"}
            border={"#d6d6d6 solid 2px"}
            borderRadius={"50px"}
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
            <Flex fontWeight={"700"} color="#2c5282">
              {userSelector?.address?.city
                ? userSelector?.address.city
                : "Location"}
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

            <ModalBody maxW="500px">
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
                  <Box cursor={"pointer"} onClick={() => nav("/cart")}>
                    Cart
                  </Box>
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
            <MenuList my={5} position={"fixed"} left={"-6em"}>
              <Flex padding={"0 0.5rem"} flexDir={"column"} gap={"0.4rem"}>
                <Flex
                  px={"10px"}
                  gap={"1rem"}
                  color={location == "profile" ? "white" : "black"}
                  bg={location == "profile" ? "#25225a" : "white"}
                  onClick={() => nav("/profile")}
                  cursor={"pointer"}
                >
                  My Account
                </Flex>
                <Flex px={"10px"}>My Orders</Flex>
                <Flex px={"10px"}>My Wishlist</Flex>
                <Flex px={"10px"} onClick={userSelector.email ? logout : login}>
                  {userSelector.email ? "Logout" : "Login"}
                </Flex>
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

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
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
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Kategori",
    children: [
      {
        label: "Internasional",
        href: "#",
      },
      {
        label: "Novel",
        href: "#",
      },
      {
        label: "History",
        href: "#",
      },
      {
        label: "Comic",
        href: "#",
      },
      {
        label: "Self Improvement",
        href: "#",
      },
      {
        label: "Engineering",
        href: "#",
      },
    ],
  },
  {
    label: "Keranjang",
    href: "#",
  },
  {
    label: "Masuk",
    href: "#",
  },
  {
    label: "Bantuan",
    href: "#",
  },
];
