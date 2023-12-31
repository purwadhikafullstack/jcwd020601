import {
  Box,
  Flex,
  Image,
  Icon,
  InputGroup,
  Input,
  InputRightElement,
  Center,
  Text,
  useMediaQuery,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { GoSearch } from "react-icons/go";
import { api } from "../../api/api";
import logo from "../../assets/images/gramedia-icon-2.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import MobileNav from "../MobileNav";
import ModalSelectAddress from "./ModalSelectAddress";
import CartButtonAndMenu from "./CartButtonAndMenu";
import MenuKategori from "./MenuKategori";
export default function Navbar({ callback, keyword }) {
  const locatio = useLocation();
  const location = locatio.pathname.split("/")[1];
  const modalSelectAddress = useDisclosure();
  const toast = useToast();
  const [userAddresses, setUserAddresses] = useState([]);
  const [userAddress, setUserAddress] = useState([]);
  const userSelector = useSelector((state) => state.login.auth);
  const [large] = useMediaQuery("(min-width: 768px)");
  const [category, setCategory] = useState([]);
  async function fetchUserAddresses() {
    try {
      const fetchAddress = await api().get("/address/user/" + userSelector.id);
      setUserAddresses(fetchAddress.data);
    } catch (err) {
      alert(err.data.message);
      toast({
        position: "top",
        title: "Something went a",
        description: err.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }
  const fetchCategori = async () => {
    let response = await api().get(`/category`);
    setCategory(response.data.result);
  };
  useEffect(() => {
    if (userSelector.email) {
      fetchUserAddresses();
      setUserAddress(userSelector.address);
    }
  }, []);
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
        <ModalSelectAddress
          userAddresses={userAddresses}
          modalSelectAddress={modalSelectAddress}
          userAddress={userAddress}
          setUserAddress={setUserAddress}
        />
        {large ? (
          <DesktopNav
            callback={callback}
            keyword={keyword}
            category={category}
            setUserAddress={setUserAddress}
            setUserAddresses={setUserAddresses}
            userAddress={userAddress}
            userAddresses={userAddresses}
            modalSelectAddress={modalSelectAddress}
            location={location}
          />
        ) : (
          <MobileNav
            category={category}
            userAddress={userAddress}
            setUserAddress={setUserAddress}
            setUserAddresses={setUserAddresses}
            userAddresses={userAddresses}
            modalSelectAddress={modalSelectAddress}
            location={location}
          />
        )}
      </Box>
    </>
  );
}

function DesktopNav({
  category,
  setUserAddress,
  userAddress,
  userAddresses,
  modalSelectAddress,
  location,
}) {
  const userSelector = useSelector((state) => state.login.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [trans, setTrans] = useState(true);
  const [input, setInput] = useState("");
  const [result, setResult] = useState([]);
  const orderSelector = useSelector((state) => state.login.order);

  function handleTrans() {
    setTrans(!trans);
  }
  async function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("address");
    localStorage.removeItem("Latitude");
    localStorage.removeItem("Longitude");
    dispatch({
      type: "logout",
    });
    nav("/login");
  }
  async function login() {
    nav("/login");
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
          <MenuKategori
            handleTrans={handleTrans}
            trans={trans}
            category={category}
            setTrans={setTrans}
            nav={nav}
          />
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
              placeholder="Search Book"
              color="blue.700"
              borderRadius={"0"}
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              style={{
                placeholder: {
                  color: "red.700",
                },
              }}
              w={{ sm: "15em", md: "18em", lg: "30em" }}
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
        <ModalSelectAddress
          userAddresses={userAddresses}
          modalSelectAddress={modalSelectAddress}
          userAddress={userAddress}
          setUserAddress={setUserAddress}
        />
      </Box>
      <CartButtonAndMenu logout={logout} login={login} nav={nav} />
    </>
  );
}
