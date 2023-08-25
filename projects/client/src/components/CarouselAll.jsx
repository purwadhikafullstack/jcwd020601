import {
  Flex,
  Box,
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  CardFooter,
  ButtonGroup,
  Button,
  Divider,
  useMediaQuery,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";
import { BsChevronDown, BsCart } from "react-icons/bs";
import { Link } from "react-router-dom";
export default function CarouselAll() {
  const [large] = useMediaQuery("(min-width: 1280px)");
  let t = localStorage.getItem("auth");
  const orderSelector = useSelector((state) => state.login.order);
  const [value, setValue] = useState([]);
  const [token, setToken] = useState(JSON.parse(t));
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  // const place = 1;
  async function fetchProduct() {
    let response = await api().get(
      `/stock/Desc?limit=${limit}&place=${orderSelector.BranchId}`
    );
    setValue(response.data.result);
  }
  useEffect(() => {
    fetchProduct();
  }, [token, orderSelector.BranchId]);
  console.log(value);

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
          Buku - Buku Terpopuler
        </Text>
        <Text
          fontSize={{ base: "sm", xl: "xl" }}
          color={"blue.400"}
          cursor={"pointer"}
        >
          <Link to="/products/filter">Lihat Semua</Link>
        </Text>
      </Box>
      <Box display={"flex"} gap={"25px"} justifyContent={"center"}>
        {large ? (
          <>
            <Box justifyContent={"center"} h={"500px"} alignItems={"center"}>
              <Card>
                <Image
                  src={
                    "https://cdn.gramedia.com/uploads/category-list/Banner_Category_Gcom_-_April_2023_2_Novel_Terbaru_6xPgO1D__w204_hauto.png"
                  }
                  alt="Green double couch with wooden legs"
                  borderRadius="lg"
                  w={"250px"}
                  h={"500px"}
                />
              </Card>
            </Box>
          </>
        ) : (
          <></>
        )}
        <Box
          display={"flex"}
          gap={"25px"}
          mb={"120px"}
          flexWrap={"wrap"}
          justifyContent={"center"}
        >
          {value.map((val, idx) => (
            <Link
              to={`/products/detail/${val.id}`}
              cursor={"pointer"}
              // bgColor={"red.200"}
              key={idx}
              p={0}
            >
              <Card
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
                      src={val.Book?.book_url}
                      alt="Green double couch with wooden legs"
                      borderRadius="lg"
                      w={{
                        base: "240px",
                        sm: "220px",
                        md: "200px",
                        lg: "160px",
                      }}
                      h={{
                        base: "240px",
                        sm: "220px",
                        md: "200px",
                        lg: "160px",
                      }}
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
                                  Rp.
                                  {Intl.NumberFormat().format(val.Book?.price)}
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
      </Box>

      <Divider w={"75%"} />
    </Flex>
  );
}
