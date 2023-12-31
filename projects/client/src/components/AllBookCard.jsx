import {
  Box,
  Center,
  Text,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TooFarModal from "./TooFarModal";
import ValueAllBookCard from "./valueAllBookCard";
import Swal from "sweetalert2";

export default function AllBookCard({ keyword }) {
  const IMG = process.env.REACT_APP_API_IMAGE_URL;
  const dispatch = useDispatch();
  const quantitySelector = useSelector((state) => state.login.qty);
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
      let response = await api().get(
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
                <ValueAllBookCard
                  val={val}
                  idx={idx}
                  add={add}
                  percent={percent}
                />
              ))}
            </>
          )}
        </Box>
      </Center>
    </>
  );
}
