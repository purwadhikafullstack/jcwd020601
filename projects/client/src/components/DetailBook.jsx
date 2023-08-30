import {
  Box,
  Center,
  Text,
  Image,
  List,
  ListItem,
  ListIcon,
  Button,
  OrderedList,
  UnorderedList,
  useToast,
  Input,
  Flex,
} from "@chakra-ui/react";
import ValueImgCapDetailBook from "./valueImgCapDetailBook";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import tooFarModal from "./TooFarModal";

export default function DetailBookPage() {
  const IMG = process.env.REACT_APP_API_IMAGE_URL;

  const orderSelector = useSelector((state) => state.login.order);
  const userSelector = useSelector((state) => state.login.auth);
  const toast = useToast();
  const nav = useNavigate();
  const { id } = useParams();
  const [value, setValue] = useState([]);
  const [qty, setQty] = useState(1);
  async function fetchProduct() {
    let response = await api().get(`/stock/${parseInt(id)}`);
    setValue(response.data);
  }
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Add to Cart
  async function add() {
    try {
      if (userSelector.username) {
        await api().post("cart/v1", {
          qty: qty,
          UserId: userSelector.id,
          StockId: value.id,
        });
        nav("/cart");
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
            base: "center",
            sm: "normal",
            md: "normal",
            lg: "normal",
            xl: "normal",
          }}
        >
          <ValueImgCapDetailBook value={value} percent={percent} />
          <Flex flexDir={"column"} gap={3}>
            <Box>
              <Input
                width={"4rem"}
                type="number"
                defaultValue={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              ></Input>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={5}
              alignItems={"center"}
            >
              <Text fontWeight={"semibold"} fontSize={"lg"}>
                Sub Total :
              </Text>
              <Text fontWeight={"semibold"} fontSize={"lg"} color={"blue.600"}>
                {value.Discount?.discount ? (
                  <>
                    {value.Discount?.isPercent ? (
                      <>
                        <Box gap={3} display={"flex"} flexDir={"column"}>
                          <Text fontSize="xl">
                            Rp.
                            {Intl.NumberFormat().format(
                              value.Book?.price -
                                percent(
                                  value.Discount?.discount,
                                  value.Book?.price
                                )
                            )}
                          </Text>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box gap={3} display={"flex"} flexDir={"column"}>
                          <Text fontSize="xl">
                            Rp.{" "}
                            {Intl.NumberFormat().format(
                              value.Book?.price - value.Discount?.discount
                            )}
                          </Text>
                        </Box>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Text fontSize="xl">
                      Rp. {Intl.NumberFormat().format(value.Book?.price)}
                    </Text>
                  </>
                )}
              </Text>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"} gap={5}>
              <Button
                variant="solid"
                colorScheme="blue"
                onClick={
                  orderSelector.TooFar
                    ? () => tooFarModal.onOpen()
                    : () => add()
                }
              >
                Add to Cart
              </Button>
            </Box>
          </Flex>
        </Box>
      </Center>
    </>
  );
}
