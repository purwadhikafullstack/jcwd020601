import {
  Box,
  Flex,
  Card,
  CardBody,
  Text,
  Image,
  Divider,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function BookCard() {
  const IMG = process.env.REACT_APP_API_IMAGE_URL;
  let t = localStorage.getItem("auth");
  const userSelector = useSelector((state) => state.login.auth);
  const orderSelector = useSelector((state) => state.login.order);
  const tooFarModal = useDisclosure();
  const nav = useNavigate();
  const toast = useToast();
  const [value, setValue] = useState([]);
  const [token, setToken] = useState(JSON.parse(t));
  const [limit, setLimit] = useState(6);
  console.log(orderSelector);
  async function fetchProduct() {
    let response = await api().get(
      `/stock?limit=${limit}&place=${orderSelector.BranchId}`
    );
    console.log(response);
    setValue(response.data.result);
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
  async function add(idx) {
    try {
      if (userSelector.username) {
        await api().post("cart/v1", {
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
  const percent = (a, b) => {
    let result = (a / 100) * b;
    return result;
  };
  // console.log(value);
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
        justifyContent={{
          base: "space-evenly",
          sm: "space-between",
          md: "space-between",
          lg: "space-between",
          xl: "space-between",
        }}
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
        justifyContent={{
          base: "center",
          sm: "center",
          md: "center",
          lg: "center",
          xl: "flex-start",
        }}
      >
        {value.map((val, idx) => (
          <Link key={idx} to={`/products/detail/${val.id}`} cursor={"pointer"}>
            <Card
              // h={"360px"}
              h={{
                base: "440px",
                lg: "370px",
              }}
            >
              <CardBody>
                <Box>
                  {val.Discount?.discount ? (
                    <>
                      {val.Discount?.isPercent ? (
                        <>
                          <Box
                            w={14}
                            h={8}
                            position={"absolute"}
                            left={{
                              base: "225px",
                              md: "185px",
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
                              base: "200px",
                              md: "190px",
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
                    src={IMG + val.Book?.book_url}
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
            </Card>
          </Link>
        ))}
      </Box>
    </Flex>
  );
}
