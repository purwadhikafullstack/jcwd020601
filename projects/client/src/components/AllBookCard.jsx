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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link } from "react-router-dom";
import { MdSettings } from "react-icons/md";
import { useSelector } from "react-redux";
export default function AllBookCard({ keyword }) {
  const orderSelector = useSelector((state) => state.login.order);
  let t = localStorage.getItem("auth");
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
      let response = await api.get(`/stock?limit=${limit}&place=${place}`);
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
  }, [token, keyword, place]);
  // console.log(value);
  // console.log(place);
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
                <Link to={`/products/detail/${val.id}`} cursor={"pointer"}>
                  <Card
                    key={idx}
                    w={{ base: "250px", sm: "250px", md: "250px", lg: "200px" }}
                    h={"400px"}
                  >
                    <CardBody>
                      <Box>
                        {val.Book?.Discount?.isPercent ? (
                          <>
                            <Box
                              w={10}
                              h={8}
                              // bgColor={"blue"}
                              position={"absolute"}
                              left={"140px"}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text fontWeight={"bold"}>
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
                            base: "300px",
                            sm: "280px",
                            md: "260px",
                            lg: "220px",
                          }}
                          h={{
                            base: "300px",
                            sm: "280px",
                            md: "260px",
                            lg: "220px",
                          }}
                        />
                      </Box>
                      <Stack mt="6">
                        <Heading size="sm">{val.Book?.author}</Heading>
                        <Text size={"sm"}>
                          {val.Book?.title.length > 15
                            ? val.Book?.title.slice(0, 15) + "..."
                            : val.Book?.title}
                        </Text>
                        <Text color="blue.600" fontSize="xl">
                          {val.Book?.Discount?.discount ? (
                            <>
                              {val.Book?.Discount?.isPercent ? (
                                <>
                                  <Text>Rp.{val.Book?.price}</Text>
                                </>
                              ) : (
                                <>
                                  <Text color="red.600" as="del" fontSize="xl">
                                    Rp. {val.Book?.price}
                                  </Text>
                                  <Text>
                                    Rp.{" "}
                                    {val.Book?.price -
                                      val.Book?.Discount?.discount}
                                  </Text>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <Text>Rp.{val.Book?.price}</Text>
                            </>
                          )}
                        </Text>
                        <Text color="blue.600" fontSize="xl"></Text>
                      </Stack>
                    </CardBody>
                    <CardFooter>
                      {/* <ButtonGroup spacing="2" justifyContent={"center"}>
									<Button variant="solid" colorScheme="blue">
										Buy now
									</Button>
									<Button variant="ghost" colorScheme="blue">
										Add to cart
									</Button>
								</ButtonGroup> */}
                      {/* <Text color="blue.600" fontSize="xl">
                    Rp. {val.Book?.price}
                  </Text> */}
                    </CardFooter>
                  </Card>
                </Link>
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
