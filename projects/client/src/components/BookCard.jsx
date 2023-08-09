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
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function BookCard() {
  let t = localStorage.getItem("auth");

  const userSelector = useSelector((state) => state.login.auth);
  const nav = useNavigate();
  const [value, setValue] = useState([]);
  const [token, setToken] = useState(JSON.parse(t));
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");

  const orderSelector = useSelector((state) => state.login.order);

  console.log(orderSelector);
  async function fetchProduct() {
    let response = await api.get(`/stock?limit=${limit}`);
    setValue(response.data.result);
    // console.log(response);
  }
  useEffect(() => {
    fetchProduct();
  }, [token]);
  console.log(value);
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
      alert(error.response.data);
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
              <Image
                src={val.Book?.book_url}
                alt="Green double couch with wooden legs"
                borderRadius="lg"
                w={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
                h={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
              />
              <Stack mt="6">
                <Heading size="sm">{val.Book?.author}</Heading>
                <Text size={"sm"}>
                  {val.Book?.title.length > 15
                    ? val.Book?.title.slice(0, 15) + "..."
                    : val.Book?.title}
                </Text>
                <Text color="#A0AEC0" as="del" fontSize="xl">
                  Rp. {val.Book?.price}
                </Text>
                <Text color="blue.600" fontSize="xl">
                  Rp. {val.Book?.price}
                </Text>
                <Text color="blue.600" fontSize="xl">
                  {val.Book?.Discount?.discount ? (
                    <>Diskon {val.Book?.Discount?.discount} %</>
                  ) : (
                    <></>
                  )}
                </Text>
              </Stack>
            </CardBody>
            <CardFooter p={5}>
              <ButtonGroup justifyContent={"center"}>
                {/* <Button variant="solid" colorScheme="blue">
                  Buy now
                </Button> */}
                <Button
                  variant="solid"
                  colorScheme="blue"
                  onClick={() => add(idx)}
                >
                  Add to cart
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))}
      </Box>
    </Flex>
  );
}
