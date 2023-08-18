import {
  Box,
  Flex,
  Card,
  CardBody,
  Stack,
  Heading,
  Text,
  CardFooter,
  Button,
  Image,
  ButtonGroup,
  Divider,
  useMediaQuery,
  useToast,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import TooFarModal from "./TooFarModal";
import { BsChevronDown, BsCart } from "react-icons/bs";
export default function BookCard() {
  let t = localStorage.getItem("auth");
  const userSelector = useSelector((state) => state.login.auth);
  const orderSelector = useSelector((state) => state.login.order);
  const tooFarModal = useDisclosure();
  const nav = useNavigate();
  const toast = useToast();
  const [value, setValue] = useState([]);
  const [token, setToken] = useState(JSON.parse(t));
  const [limit, setLimit] = useState(6);
  const [keyword, setKeyword] = useState("");
  const [place, setPlace] = useState();
  // Link
  // const place = 2;
  // console.log(place);
  // console.log(value);
  console.log(orderSelector);
  async function fetchProduct() {
    let response = await api.get(
      `/stock?limit=${limit}&place=${orderSelector.BranchId}`
    );
    console.log(response);
    setValue(response.data.result);
    console.log(response.data.result);
  }
  useEffect(() => {
    fetchProduct();
    console.log("asd");
  }, [token, orderSelector.BranchId]);

  console.log(value);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  // console.log(value);
  // console.log(token);
  async function add(idx) {
    try {
      if (userSelector.username) {
        await api.post("cart/v1", {
          qty: 1,
          UserId: userSelector.id,
          StockId: value[idx].id,
        });
      } else {
        Swal.fire("You need to login first?", "", "question");
        nav("/login");
      }
    } catch (error) {
      toast({
        title: error.response.data,
        position: "top",
        containerStyle: {
          maxWidth: "30%",
        },
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  }
  console.log(value);
  return (
    <Flex
      justify={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      my={"50px"}
    >
      <Divider w={"75%"} />
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        w={{
          base: "340px",
          sm: "480px",
          md: "768px",
          lg: "992px",
          xl: "1280px",
        }}
        my={"10px"}
      >
        <Text
          fontSize={{ base: "lg", lg: "2xl", xl: "3xl" }}
          color={"blue.700"}
          fontWeight={{ base: "bold", md: "normal" }}
        >
          Rekomendasi Gramedia
        </Text>
        <Text
          fontSize={{ base: "sm", xl: "xl" }}
          color={"blue.400"}
          cursor={"pointer"}
        >
          <Link to="/products">Lihat Semua</Link>
        </Text>
      </Box>
      <Box
        display={"flex"}
        gap={"30px"}
        flexWrap={"wrap"}
        justifyContent={"center"}
      >
        {value.map((val, idx) => (
          <Link
            to={`/products/detail/${val.id}`}
            cursor={"pointer"}
            // bgColor={"red.200"}
          >
            <Card key={idx}>
              <CardBody>
                <Box>
                  {val.Discount?.isPercent ? (
                    <>
                      <Box
                        w={12}
                        h={8}
                        position={"absolute"}
                        left={"152px"}
                        borderTopRightRadius={"5px"}
                        top={"0px"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgColor={"blue.100"}
                      >
                        <Text fontWeight={"bold"} color={"blue.900"}>
                          {val.Discount?.discount}%
                        </Text>
                      </Box>
                    </>
                  ) : (
                    <></>
                  )}
                  <Image
                    src={val.Book?.book_url}
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                    w={{ base: "240px", sm: "220px", md: "200px", lg: "160px" }}
                    h={{ base: "240px", sm: "220px", md: "200px", lg: "160px" }}
                  />
                </Box>
                <Flex flexDir={"column"} my={5} gap={3}>
                  <Text color="#4A5568" as={"i"}>
                    {val.Book?.author.length > 15
                      ? val.Book?.author.slice(0, 15) + "..."
                      : val.Book?.author}
                  </Text>
                  <Text fontSize="lg">
                    {val.Book?.title.length > 15
                      ? val.Book?.title.slice(0, 15) + "..."
                      : val.Book?.title}
                  </Text>
                  <Text color="blue.600" fontSize="md">
                    {val.Discount?.discount ? (
                      <>
                        {val.Discount?.isPercent ? (
                          <>
                            {/* val.Book?.price */}
                            <Text fontSize="xl">
                              Rp.{Intl.NumberFormat().format(val.Book?.price)}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Box gap={3} display={"flex"} flexDir={"column"}>
                              <Text color="#A0AEC0" as="del" fontSize="md">
                                Rp.{" "}
                                {Intl.NumberFormat().format(val.Book?.price)}
                              </Text>
                              <Text fontSize="xl">
                                Rp.{" "}
                                {Intl.NumberFormat().format(
                                  val.Book?.price - val.Discount?.discount
                                )}
                              </Text>
                            </Box>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <Text fontSize="xl">
                          Rp. {Intl.NumberFormat().format(val.Book?.price)}
                        </Text>
                      </>
                    )}
                  </Text>
                </Flex>
              </CardBody>
              {/* <CardFooter>
              <ButtonGroup justifyContent={"center"}>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  // p={5}
                  onClick={
                    orderSelector.TooFar
                      ? () => tooFarModal.onOpen()
                      : () => add(idx)
                  }
                > */}
              {/* Add to cart */}
              {/* <Icon as={BsCart} w={8} h={8} color="whiteAlpha.900"></Icon>
                </Button>
              </ButtonGroup>
            </CardFooter>
            <TooFarModal tooFarModal={tooFarModal} /> */}
            </Card>
          </Link>
        ))}
      </Box>
    </Flex>
  );
}
