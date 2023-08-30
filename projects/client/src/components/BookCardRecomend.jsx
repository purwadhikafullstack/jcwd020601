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
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import ValueBookCardRecomend from "./valueBookCardRecomend";
export default function BookCardRecomend() {
  const IMG = process.env.REACT_APP_API_IMAGE_URL;
  const orderSelector = useSelector((state) => state.login.order);
  const userSelector = useSelector((state) => state.login.auth);
  let t = localStorage.getItem("auth");
  const dispatch = useDispatch();
  const quantitySelector = useSelector((state) => state.login.qty);
  const toast = useToast();
  const nav = useNavigate();
  const [value, setValue] = useState([]);
  const [token, setToken] = useState(JSON.parse(t));
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [place, setPlace] = useState(orderSelector.BranchId);

  async function fetchProduct() {
    let response = await api().get(`/stock?limit=${limit}&place=${place}`);
    setValue(response.data.result);
  }
  useEffect(() => {
    fetchProduct();
  }, [token]);
  async function add(idx) {
    try {
      if (userSelector.username) {
        await api().post("cart/v1", {
          qty: 1,
          UserId: userSelector.id,
          StockId: value[idx].id,
        });
        dispatch({
          type: "qty",
          payload: {
            quantity: quantitySelector.quantity + 1,
          },
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
      my={"40px"}
      // mx={"40px"}
    >
      {/* <Divider w={"75%"} /> */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        px={20}
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
          fontSize={{ base: "lg", lg: "xl", xl: "2xl" }}
          color={"blue.700"}
          fontWeight={{ base: "bold", md: "normal" }}
        >
          Rekomendasi Untukmu
        </Text>
        <Text
          fontSize={{ base: "sm", xl: "xl" }}
          color={"blue.400"}
          cursor={"pointer"}
        ></Text>
      </Box>
      <Box
        display={"flex"}
        gap={"15px"}
        p={8}
        flexWrap={"wrap"}
        justifyContent={"space-evenly"}
        bgColor={"blue.200"}
        mx={"10px"}
        borderRadius={"10px"}
      >
        {value.map((val, idx) => (
          <ValueBookCardRecomend
            val={val}
            idx={idx}
            add={add}
            percent={percent}
          />
        ))}
      </Box>
    </Flex>
  );
}
