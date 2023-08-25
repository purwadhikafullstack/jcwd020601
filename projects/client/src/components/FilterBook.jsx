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
import { Link, useNavigate, useParams } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import TooFarModal from "./TooFarModal";
import Swal from "sweetalert2";

export default function FilterBook() {
  const orderSelector = useSelector((state) => state.login.order);
  const userSelector = useSelector((state) => state.login.auth);
  // const history = useHistory();
  let t = localStorage.getItem("auth");
  const toast = useToast();
  const nav = useNavigate();
  const { categoryId } = useParams();
  const tooFarModal = useDisclosure();
  const [value, setValue] = useState([]);
  const [token, setToken] = useState(JSON.parse(t));
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState("");
  const [data, setData] = useState(null);
  async function fetchProduct() {
    try {
      setIsLoading(true);
      let url = `/stock/price?price=${price}&place=${orderSelector.BranchId}`;
      if (data !== null) {
        url += `&category=${data}`;
      }

      const response = await api().get(url);
      console.log(response);
      setValue(response.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (categoryId) {
      setData(parseInt(categoryId));
    }
    fetchProduct();
    // fetchCategori();
  }, [price, data, categoryId]);

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
  const onChangeCategory = (e) => {
    nav(`/products/filter/${parseInt(e)}`);
    if (e == "") {
      setData(null);
      nav(`/products/filter`);
    }

    // console.log(e);
  };
  const fetchCategori = async () => {
    let response = await api().get(`/category`);
    setCategory(response.data.result);
  };
  useEffect(() => {
    fetchCategori();
  }, []);

  console.log(categoryId);

  const onChange = (e) => {
    const value = e.target.value;
    setPrice(value);
  };
  console.log(data);
  console.log(price);
  // console.log(categoryId);
  const percent = (a, b) => {
    let result = (a / 100) * b;
    return result;
  };
  return (
    <>
      <Center my={3} display={"flex"} flexDirection={"column"}>
        <Box
          display={"flex"}
          flexDir={{ base: "column", sm: "column", md: "column", lg: "row" }}
          h={"78vh"}
          overflowY={"scroll"}
          // bgColor={"yellow.100"}
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
          p={3}
          gap={3}
          alignItems={{
            base: "center",
            sm: "center",
            md: "center",
            lg: "flex-start",
          }}
        >
          <Box
            w={{ base: "800px", lg: "400px" }}
            justifyContent={{ base: "space-evenly", lg: "center" }}
            display={"flex"}
            px={10}
            py={3}
            alignItems={{
              base: "center",
              sm: "center",
              md: "center",
              lg: "flex-start",
            }}
          >
            <Box
              display={"flex"}
              flexDir={{
                base: "column",
                sm: "column",
                md: "row",
                lg: "column",
              }}
              gap={5}
            >
              <Heading as="h3" size="lg">
                Filter
              </Heading>
              <Box gap={3} display={"flex"} flexDir={"column"}>
                <Heading as="h4" size="md">
                  Kategori
                </Heading>
                <Select
                  onChange={(e) => onChangeCategory(e.target.value)}
                  placeholder="Pilih Kategori"
                  value={data}
                  w={"200px"}
                  mr={8}
                >
                  {category.map((cate, idx) => (
                    <option key={idx} value={cate.id}>
                      {cate.category}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box gap={3} display={"flex"} flexDir={"column"}>
                <Heading as="h4" size="md">
                  Harga
                </Heading>
                <Select
                  onChange={onChange}
                  placeholder="Pilih"
                  value={price}
                  w={"200px"}
                  mr={8}
                >
                  <option value="ASC">Harga Termurah</option>
                  <option value="DESC">Harga Termahal</option>
                </Select>
              </Box>
            </Box>
          </Box>
          <Box
            w={{
              base: "300px",
              sm: "450px",
              md: "600px",
              lg: "750px",
              xl: "900px",
            }}
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
          >
            {isLoading ? (
              <Box
                display={"flex"}
                justifyContent={"center"}
                flexDir={"column"}
                mx={"auto"}
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Box>
            ) : (
              <>
                {value.map((val, idx) => (
                  <Card
                    key={idx}
                    w={{ base: "250px", sm: "250px", md: "250px", lg: "200px" }}
                    h={{ base: "520px", lg: "440px" }}
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
                            {val.Discount?.discount ? (
                              <>
                                {val.Discount?.isPercent ? (
                                  <>
                                    <Box
                                      gap={3}
                                      display={"flex"}
                                      flexDir={"column"}
                                    >
                                      <Text
                                        fontSize="md"
                                        my={0}
                                        as={"del"}
                                        color={"blackAlpha.500"}
                                      >
                                        Rp.
                                        {Intl.NumberFormat().format(
                                          val.Book?.price
                                        )}
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
                                    <Box
                                      gap={3}
                                      display={"flex"}
                                      flexDir={"column"}
                                    >
                                      <Text
                                        fontSize="md"
                                        my={0}
                                        as={"del"}
                                        color={"blackAlpha.500"}
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
                                            val.Discount?.discount
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
