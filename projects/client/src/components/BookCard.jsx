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
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import TooFarModal from "./TooFarModal";
export default function BookCard() {
  let t = localStorage.getItem("auth");
  const userSelector = useSelector((state) => state.login.auth);
  const orderSelector = useSelector((state) => state.login.order);
  const tooFarModal = useDisclosure();
  const nav = useNavigate();
  const toast = useToast();
  const [value, setValue] = useState([]);
  const [token, setToken] = useState(JSON.parse(t));
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [place, setPlace] = useState(orderSelector.BranchId);
  console.log(place);
  console.log(value);
  // console.log(orderSelector.);
  async function fetchProduct() {
    let response = await api.get(`/stock?limit=${limit}&place=${place}`);
    setValue(response.data.result);
  }
  useEffect(() => {
    fetchProduct();
  }, [token, orderSelector, place]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  console.log(value);
  console.log(token);
  // Add to Cart
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
        gap={"25px"}
        flexWrap={"wrap"}
        justifyContent={"center"}
      >
        {value.map((val, idx) => (
          <Card key={idx}>
            <CardBody>
              <Box>
                {val.Book?.Discount?.isPercent ? (
                  <>
                    <Box
                      w={10}
                      h={8}
                      // bgColor={"blue"}
                      position={"absolute"}
                      left={"200px"}
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
                  w={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
                  h={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
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
                            Rp. {val.Book?.price - val.Book?.Discount?.discount}
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
              </Stack>
            </CardBody>
            <CardFooter p={5}>
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
      </Box>
    </Flex>
  );
}
