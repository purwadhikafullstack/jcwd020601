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
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TooFarModal from "./TooFarModal";
import Swal from "sweetalert2";
export default function BookCardRecomend() {
  const orderSelector = useSelector((state) => state.login.order);
  const userSelector = useSelector((state) => state.login.auth);
  let t = localStorage.getItem("auth");
  const dispatch = useDispatch();
  const quantitySelector = useSelector((state) => state.login.qty);
  const toast = useToast();
  const nav = useNavigate();
  const tooFarModal = useDisclosure();
  const [value, setValue] = useState([]);
  const [token, setToken] = useState(JSON.parse(t));
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [place, setPlace] = useState(orderSelector.BranchId);

  async function fetchProduct() {
    let response = await api().get(`/stock?limit=${limit}&place=${place}`);
    setValue(response.data.result);
  }
  useEffect(() => {
    fetchProduct();
  }, [token]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  console.log(value);
  console.log(token);
  async function add(idx) {
    try {
      if (userSelector.username) {
        await api().post("cart/v1", {
          qty: 1,
          UserId: userSelector.id,
          StockId: value[idx].id,
        });
        dispatch({
          type: "qty",
          payload: {
            quantity: quantitySelector.quantity + 1,
          },
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
  const percent = (a, b) => {
    let result = (a / 100) * b;
    return result;
  };
  return (
    <Flex
      justify={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      my={"40px"}
      // mx={"40px"}
    >
      {/* <Divider w={"75%"} /> */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        px={20}
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
          fontSize={{ base: "lg", lg: "xl", xl: "2xl" }}
          color={"blue.700"}
          fontWeight={{ base: "bold", md: "normal" }}
        >
          Rekomendasi Untukmu
        </Text>
        <Text
          fontSize={{ base: "sm", xl: "xl" }}
          color={"blue.400"}
          cursor={"pointer"}
        ></Text>
      </Box>
      <Box
        display={"flex"}
        gap={"15px"}
        p={8}
        flexWrap={"wrap"}
        justifyContent={"space-evenly"}
        bgColor={"blue.200"}
        mx={"10px"}
        borderRadius={"10px"}
      >
        {value.map((val, idx) => (
          <Link key={idx} to={`/products/detail/${val.id}`} cursor={"pointer"}>
            <Card
              w={{ base: "250px", sm: "250px", md: "250px", lg: "200px" }}
              h={{
                base: "550px",
                lg: "460px",
              }}
            >
              <CardBody>
                {val.Discount?.discount ? (
                  <>
                    {val.Discount?.isPercent ? (
                      <>
                        <Box
                          w={14}
                          h={8}
                          position={"absolute"}
                          left={{
                            base: "195px",
                            md: "195px",
                            lg: "145px",
                          }}
                          borderTopRightRadius={"5px"}
                          top={"0px"}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bgColor={"blue.100"}
                        >
                          <Text color={"blue.900"}>
                            -{val.Discount?.discount}%
                          </Text>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box
                          w={20}
                          h={8}
                          position={"absolute"}
                          left={{
                            base: "170px",
                            md: "170px",
                            lg: "122px",
                          }}
                          borderTopRightRadius={"5px"}
                          top={"0px"}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bgColor={"blue.100"}
                        >
                          <Text fontSize="md">
                            {/* - */}
                            {Intl.NumberFormat().format(
                              "-" + val.Discount?.discount
                            )}
                          </Text>
                        </Box>
                      </>
                    )}
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
                    {/* {val.Book?.Discount?.discount ? (
                      <>
                        {val.Book?.Discount?.isPercent ? (
                          <>
                            
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
                                  val.Book?.price - val.Book?.Discount?.discount
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
                    )} */}
                    {val.Discount?.discount ? (
                      <>
                        {val.Discount?.isPercent ? (
                          <>
                            <Box gap={3} display={"flex"} flexDir={"column"}>
                              <Text
                                fontSize="md"
                                my={0}
                                as={"del"}
                                color={"blackAlpha.500"}
                              >
                                Rp.{Intl.NumberFormat().format(val.Book?.price)}
                              </Text>
                              <Text fontSize="xl">
                                Rp.
                                {Intl.NumberFormat().format(
                                  val.Book?.price -
                                    percent(
                                      val.Discount?.discount,
                                      val.Book?.price
                                    )
                                )}
                              </Text>
                            </Box>
                          </>
                        ) : (
                          <>
                            <Box gap={3} display={"flex"} flexDir={"column"}>
                              <Text
                                fontSize="md"
                                my={0}
                                as={"del"}
                                color={"blackAlpha.500"}
                              >
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
              <CardFooter p={5}>
                <ButtonGroup spacing="2" justifyContent={"center"}>
                  {/* <Button variant="solid" colorScheme="blue">
                  Buy now
                </Button> */}
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    onClick={
                      orderSelector.TooFar
                        ? () => tooFarModal.onOpen()
                        : () => add(idx)
                    }
                  >
                    Add to cart
                  </Button>
                </ButtonGroup>
              </CardFooter>
              <TooFarModal tooFarModal={tooFarModal} />
            </Card>
          </Link>
        ))}
      </Box>
    </Flex>
  );
}
