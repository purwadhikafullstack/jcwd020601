import {
  Box,
  Center,
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Spinner,
  Flex,
  Button,
  Icon,
  ButtonGroup,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { MdSettings } from "react-icons/md";
import { useSelector } from "react-redux";
import TooFarModal from "./TooFarModal";
import Swal from "sweetalert2";
import { BsChevronDown, BsCart } from "react-icons/bs";
export default function AllBookCard({ keyword }) {
  const orderSelector = useSelector((state) => state.login.order);
  const userSelector = useSelector((state) => state.login.auth);
  let t = localStorage.getItem("auth");
  const toast = useToast();
  const nav = useNavigate();
  const tooFarModal = useDisclosure();
  const [value, setValue] = useState([]);
  const [token, setToken] = useState(JSON.parse(t));
  const [place, setPlace] = useState(orderSelector.BranchId);
  const [limit, setLimit] = useState(0);

  // const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // console.log(value);
  async function fetchProduct() {
    try {
      setIsLoading(true);
      let response = await api.get(
        `/stock?limit=${limit}&place=${orderSelector.BranchId}`
      );
      setValue(response.data.result);
      setTimeout(() => {
        setIsLoading(false); // Set isLoading to false after 2 seconds
      }, 1000);
    } catch (error) {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchProduct();
  }, [token, keyword, orderSelector.BranchId]);
  // console.log(value);
  // console.log(place);
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
  return (
    <>
      <Center
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        // my={10}
        minH={"80vh"}
      >
        <Box
          // bgColor={"red"}
          maxWidth={"1100px"}
          display={"flex"}
          gap={3}
          p={3}
          flexWrap={"wrap"}
          justifyContent={{
            base: "center",
            sm: "center",
            md: "center",
            lg: "flex-start",
          }}
          // my={10}
        >
          {isLoading ? (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          ) : (
            <>
              <Box
                w={{ base: "300px", sm: "300px", md: "600px", lg: "1000px" }}
              >
                <Text fontSize={"3xl"} fontWeight={"bold"}>
                  All Books
                </Text>
              </Box>
              {value.map((val, idx) => (
                <Card
                  key={idx}
                  w={{ base: "250px", sm: "250px", md: "250px", lg: "200px" }}
                  h={"460px"}
                >
                  <CardBody h={"200px"}>
                    <Link
                      to={`/products/detail/${val.id}`}
                      cursor={"pointer"}
                      // bgColor={"red.200"}
                    >
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
                      <Flex
                        flexDir={"column"}
                        mt={5}
                        gap={3}
                        // bgColor={"yellow.100"}
                      >
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
                                    Rp.
                                    {Intl.NumberFormat().format(
                                      val.Book?.price
                                    )}
                                  </Text>
                                </>
                              ) : (
                                <>
                                  <Box
                                    gap={3}
                                    display={"flex"}
                                    flexDir={"column"}
                                  >
                                    <Text
                                      color="#A0AEC0"
                                      as="del"
                                      fontSize="md"
                                    >
                                      Rp.{" "}
                                      {Intl.NumberFormat().format(
                                        val.Book?.price
                                      )}
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
                                Rp.{" "}
                                {Intl.NumberFormat().format(val.Book?.price)}
                              </Text>
                            </>
                          )}
                        </Text>
                      </Flex>
                    </Link>
                  </CardBody>
                  {/* <CardFooter bgColor={"yellow.100"}>
                    <ButtonGroup justifyContent={"center"}>
                      <Button variant="solid" colorScheme="blue">
                        Buy now
                      </Button> */}
                  {/* <Button variant="ghost" colorScheme="blue">
                          Add to cart
                        </Button> */}
                  {/* </ButtonGroup> */}
                  {/* <Text color="blue.600" fontSize="xl">
                    Rp. {val.Book?.price}
                  </Text> */}
                  {/* </CardFooter> */}
                  <CardFooter>
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
                      >
                        Add to cart
                        {/* <Icon
                          as={BsCart}
                          w={8}
                          h={8}
                          color="whiteAlpha.900"
                        ></Icon> */}
                      </Button>
                    </ButtonGroup>
                  </CardFooter>
                  <TooFarModal tooFarModal={tooFarModal} />
                </Card>
                // </Link>
              ))}
            </>
          )}
          {/* {value.map((val, idx) => (
            <Link to={`/detailBook/${val.id}`} cursor={"pointer"}>
              <Card
                key={idx}
                w={{ base: "250px", sm: "250px", md: "250px", lg: "200px" }}
              >
                <CardBody pb={0}>
                  <Image
                    src={val.Book?.book_url}
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                    w={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
                    h={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="sm">{val.Book?.author}</Heading>
                    <Text size={"sm"}>
                      {val.Book?.title.length > 20
                        ? val.Book?.title.slice(0, 20) + "..."
                        : val.Book?.title}
                    </Text>
                    <Text color="blue.600" fontSize="xl">
                      Rp. {val.Book?.price}
                    </Text>
                  </Stack>
                </CardBody>
                <CardFooter>
                </CardFooter>
              </Card>
            </Link>
          ))} */}
        </Box>
      </Center>
    </>
  );
}
