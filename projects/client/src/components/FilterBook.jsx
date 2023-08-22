import {
  Box,
  Center,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  Spinner,
  Flex,
  Button,
  ButtonGroup,
  useDisclosure,
  List,
  ListItem,
  Input,
  Select,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdCheckCircle, MdSettings } from "react-icons/md";
import { api } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TooFarModal from "./TooFarModal";
import Swal from "sweetalert2";

export default function FilterBook() {
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
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  async function fetchProduct() {
    try {
      setIsLoading(true);
      let response = await api.get(
        `/stock?limit=${limit}&place=${orderSelector.BranchId}`
      );
      setValue(response.data.result);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchProduct();
  }, [token, orderSelector.BranchId]);

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
  async function fetchDetail() {
    let response = await api.get(`/stock/${7}`);
    setData(response.data);
    console.log(response);
  }
  useEffect(() => {
    fetchDetail();
  }, []);
  return (
    <>
      <Center my={3} display={"flex"} flexDirection={"column"}>
        <Box
          maxW={"1200px"}
          display={"flex"}
          p={3}
          gap={3}
          flexDirection={{
            base: "column",
            sm: "column",
            md: "column",
            lg: "row",
            xl: "row",
          }}
          alignItems={{
            base: "normal",
            sm: "normal",
            md: "normal",
            lg: "normal",
            xl: "normal",
          }}
        >
          <Box
            w={"400px"}
            justifyContent={"center"}
            display={"flex"}
            px={10}
            py={3}
            bgColor={"red"}
          >
            <Box display={"flex"} flexDir={"column"} gap={3}>
              {/* {data.Discount?.discount ? (
                <>
                  {data.Discount?.isPercent ? (
                    <>
                      <Box
                        w={14}
                        h={8}
                        // position={"absolute"}
                        // left={"1px"}
                        borderTopRightRadius={"5px"}
                        // top={"0px"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgColor={"blue.100"}
                      >
                        <Text color={"blue.900"}>
                          -{data.Discount?.discount}%
                        </Text>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box
                        w={20}
                        h={8}
                        borderTopRightRadius={"5px"}
                        marginLeft={"50px"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgColor={"blue.100"}
                      >
                        <Text fontSize="md">
                          {Intl.NumberFormat().format(
                            "-" + data.Discount?.discount
                          )}
                        </Text>
                      </Box>
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
              <Image src={data.Book?.book_url} width={"200"} height={"200px"} /> */}
              <Heading as="h3" size="lg">
                Filter
              </Heading>
              <Heading as="h4" size="md">
                Kategori
              </Heading>
              <Heading as="h4" size="md">
                Harga
              </Heading>
              <Text mb="8px">Value:</Text>
              <Input
                // value={value}
                // onChange={handleChange}
                placeholder="Here is a sample placeholder"
                size="sm"
              />
            </Box>
          </Box>
          <Box
            maxWidth={"900px"}
            display={"flex"}
            // bgColor={"blue.200"}
            gap={3}
            p={3}
            flexWrap={"wrap"}
            justifyContent={{
              base: "center",
              sm: "center",
              md: "flex-start",
              // lg: "flex-start",
            }}
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
                  w={{ base: "300px", sm: "300px", md: "600px", lg: "900px" }}
                  display={"flex"}
                  justifyContent={"space-between"}
                  // bgColor={"red.100"}
                >
                  <Text fontSize={"3xl"} fontWeight={"bold"}>
                    {/* All Books */}
                  </Text>
                  <Select placeholder="Select" w={"200px"} mr={8}>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </Select>
                </Box>
                {value.map((val, idx) => (
                  <Card
                    key={idx}
                    w={{ base: "250px", sm: "250px", md: "250px", lg: "200px" }}
                    h={"400px"}
                  >
                    <CardBody>
                      <Link
                        to={`/products/detail/${val.id}`}
                        cursor={"pointer"}
                      >
                        <Box>
                          {val.Discount?.discount ? (
                            <>
                              {val.Discount?.isPercent ? (
                                <>
                                  <Box
                                    w={14}
                                    h={8}
                                    position={"absolute"}
                                    left={"145px"}
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
                                    left={"122px"}
                                    borderTopRightRadius={"5px"}
                                    top={"0px"}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    bgColor={"blue.100"}
                                  >
                                    <Text fontSize="md">
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
                            alt=""
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
                        <Flex flexDir={"column"} mt={5} gap={3}>
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
                          <Text fontSize="xl" color="blue.600">
                            Rp. {Intl.NumberFormat().format(val.Book?.price)}
                          </Text>
                        </Flex>
                      </Link>
                    </CardBody>
                    <CardFooter>
                      <ButtonGroup justifyContent={"center"}>
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
                ))}
              </>
            )}
          </Box>
        </Box>
      </Center>
    </>
  );
}
