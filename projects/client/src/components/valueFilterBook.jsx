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
import ReactPaginate from "react-paginate";
import "../App.css";
import { useSelector } from "react-redux";
import TooFarModal from "./TooFarModal";
import Swal from "sweetalert2";
export default function ValueFilterBook({ val, idx, add, percent }) {
  const IMG = process.env.REACT_APP_API_IMAGE_URL;
  const orderSelector = useSelector((state) => state.login.order);
  const userSelector = useSelector((state) => state.login.auth);
  let t = localStorage.getItem("auth");
  const toast = useToast();
  const nav = useNavigate();
  //   const { categoryId } = useParams();
  const tooFarModal = useDisclosure();
  const [value, setValue] = useState([]);
  const [token, setToken] = useState(JSON.parse(t));
  //   const [page, setPage] = useState(0);
  //   const [limit, setLimit] = useState(8);
  //   const [rows, setRows] = useState(0);
  //   const [pages, setPages] = useState(0);
  //   const [isLoading, setIsLoading] = useState(true);
  //   const [category, setCategory] = useState([]);
  //   const [price, setPrice] = useState("");
  //   const [data, setData] = useState(parseInt(categoryId));
  return (
    <>
      <Card
        key={idx}
        w={{
          base: "250px",
          sm: "250px",
          md: "250px",
          lg: "200px",
        }}
        h={{ base: "520px", lg: "440px" }}
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
                src={IMG + val.Book?.book_url}
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
                                percent(val.Discount?.discount, val.Book?.price)
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
                            Rp. {Intl.NumberFormat().format(val.Book?.price)}
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
    </>
  );
}
