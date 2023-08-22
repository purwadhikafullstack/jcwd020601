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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TooFarModal from "./TooFarModal";
import Swal from "sweetalert2";

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
  const [isLoading, setIsLoading] = useState(true);
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
  }, [token, keyword, orderSelector.BranchId]);

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
        minH={"80vh"}
      >
        <Box
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
                  h={"400px"}
                >
                  <CardBody>
                    <Link to={`/products/detail/${val.id}`} cursor={"pointer"}>
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
      </Center>
    </>
  );
}
