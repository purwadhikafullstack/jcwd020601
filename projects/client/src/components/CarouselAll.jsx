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
    let response = await api.get(
      `/stock/Desc?limit=${limit}&place=${orderSelector.BranchId}`
    );
    setValue(response.data.result);
  }
  useEffect(() => {
    fetchProduct();
  }, [token, orderSelector.BranchId]);
  console.log(value);
  console.log(token);

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
          Buku - Buku Terpopuler
        </Text>
        <Text
          fontSize={{ base: "sm", xl: "xl" }}
          color={"blue.400"}
          cursor={"pointer"}
        >
          Lihat Semua
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
          // bgColor={"red.100"}
        >
          {value.map((val, idx) => (
            <Link
              to={`/products/detail/${val.id}`}
              cursor={"pointer"}
              // bgColor={"red.200"}
            >
              <Card key={idx} p={0}>
                <CardBody>
                  <Box>
                    {val.Book?.Discount?.isPercent ? (
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
                            {val.Book?.Discount?.discount}%
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
                      {val.Book?.Discount?.discount ? (
                        <>
                          {val.Book?.Discount?.isPercent ? (
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
                                    val.Book?.price -
                                      val.Book?.Discount?.discount
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
                {/* <CardFooter p={5}>
                <ButtonGroup justifyContent={"center"}> */}
                {/* <Button variant="solid" colorScheme="blue">
                    Buy now
                  </Button> */}
                {/* <Button variant="solid" colorScheme="blue"> */}
                {/* Add to cart */}
                {/* <Icon as={BsCart} w={8} h={8} color="whiteAlpha.900"></Icon>
                  </Button>
                </ButtonGroup>
              </CardFooter> */}
              </Card>
            </Link>
          ))}
        </Box>
      </Box>

      <Divider w={"75%"} />
    </Flex>
  );
}
