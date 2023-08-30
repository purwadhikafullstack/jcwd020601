import { Box, Flex, Icon, Image, useToast } from "@chakra-ui/react";
import DeleteModal from "../components/DeleteCart";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { IoStorefrontSharp } from "react-icons/io5";
import { BsCartX } from "react-icons/bs";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useDispatch, useSelector } from "react-redux";

export default function CartBooks(props) {
  const userSelector = useSelector((state) => state.login.auth);
  const orderSelector = useSelector((state) => state.login.order);
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [hapus, setHapus] = useState(false);
  const toast = useToast();

  //GET
  async function fetch() {
    const data = await api().post("/cart/id", {
      UserId: userSelector.id,
      BranchId: orderSelector.BranchId,
    });
    setHapus(false);
    dispatch({
      type: "qty",
      payload: {
        quantity: data.data.quantity,
      },
    });
    props.setWeight(data.data.weight);
    return setCart(data.data.Cart);
  }

  console.log(cart);

  //PATCH
  async function edit(idx, type) {
    try {
      await api().patch("cart/v2", {
        StockId: cart[idx].StockId,
        UserId: cart[idx].UserId,
        id: cart[idx].id,
        type: type,
      });
      await fetch();
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
      console.error("Error in edit():", error);
    }
  }

  // Price maping (discount)
  const list = cart.map((val) => {
    if (val.Stock?.DiscountId) {
      if (val.Stock?.Discount?.isPercent) {
        return (
          (val.Stock?.Book?.price -
            val.Stock?.Book?.price * val.Stock?.Discount?.discount * 0.01) *
          val.quantity
        );
      } else {
        return (
          (val.Stock?.Book?.price - val.Stock?.Discount?.discount) *
          val.quantity
        );
      }
    } else {
      return val.Stock?.Book?.price * val.quantity;
    }
  });

  // Total Order Price
  const totalPrice = list.reduce((prev, curr) => {
    return prev + curr;
  }, 0);

  useEffect(() => {
    fetch();
  }, [hapus]);

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    setTotal(totalPrice);
    props.setTotal(totalPrice);
  }, [totalPrice]);

  return (
    <>
      <Flex
        flexDir={"column"}
        width={"100%"}
        boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
        borderRadius={"0.7rem"}
      >
        {cart[0] ? (
          cart.map((val, idx) => (
            <>
              <Flex
                padding={"1rem"}
                flexDir={"column"}
                // justifyContent={"start"}
              >
                <Box textAlign={"start"} fontWeight={"semibold"}>
                  {`Order ${idx + 1}`}
                </Box>
                <Flex alignItems={"center"} gap={"0.3rem"}>
                  <Icon as={IoStorefrontSharp}></Icon>
                  <Box>{val.Stock?.Branch?.name}</Box>
                </Flex>
              </Flex>
              <Flex
                justifyContent={"space-between"}
                alignItems={"center"}
                // padding={"1rem 2rem"}
                padding={{ base: "0.5rem", md: "1rem 2rem" }}
                flexDir={{ base: "column", lg: "row" }}
                gap={"1rem"}
              >
                <Image
                  maxHeight={"100px"}
                  src={
                    process.env.REACT_APP_API_IMAGE_URL +
                    val.Stock.Book.book_url
                  }
                ></Image>
                <Flex
                  w={{ base: "auto", md: "45%" }}
                  flexDir={"column"}
                  justifyContent={"space-evenly"}
                >
                  <Box>{val.Stock.Book.title}</Box>
                  <Box>
                    {val.Stock.Book.author} -{" "}
                    {val.Stock.Book.publish_date.slice(0, 4)}
                  </Box>
                  <Box>{`Rp ${val.Stock?.Book?.price.toLocaleString(
                    "id-ID"
                  )},-`}</Box>
                  <Box>{`${val.Stock?.Book?.weight} gr`}</Box>
                </Flex>

                <Flex gap={"1rem"} flexDir={{ md: "column" }}>
                  <Flex alignItems={"center"} gap={"1rem"}>
                    <Icon
                      fontSize={"2xl"}
                      color={"blue.400"}
                      as={AiFillMinusCircle}
                      cursor={"pointer"}
                      onClick={() => {
                        edit(idx, "minus");
                      }}
                    ></Icon>
                    <Box fontSize={"1rem"}>{val.quantity}</Box>
                    <Icon
                      fontSize={"2xl"}
                      color={"blue.400"}
                      as={AiFillPlusCircle}
                      cursor={"pointer"}
                      onClick={() => {
                        edit(idx, "plus");
                      }}
                    ></Icon>
                  </Flex>
                  <Flex
                    flexDir={"column"}
                    gap={"8px"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    {val.Stock?.DiscountId ? (
                      <Box>
                        {val.Stock?.Discount?.isPercent
                          ? `Rp ${(
                              (val.Stock?.Book?.price -
                                val.Stock?.Book?.price *
                                  val.Stock?.Discount?.discount *
                                  0.01) *
                              val.quantity
                            ).toLocaleString("id-ID")} ,-`
                          : `Rp ${(
                              (val.Stock?.Book?.price -
                                val.Stock?.Discount?.discount) *
                              val.quantity
                            ).toLocaleString("id-ID")} ,-`}
                      </Box>
                    ) : (
                      <Box>
                        Rp{" "}
                        {(val.Stock?.Book?.price * val.quantity).toLocaleString(
                          "id-ID"
                        )}{" "}
                        ,-
                      </Box>
                    )}
                  </Flex>
                </Flex>
                <Flex alignItems={"center"}>
                  {/* Delete */}
                  <DeleteModal setHapus={setHapus} cartId={val.id} />
                </Flex>
              </Flex>
            </>
          ))
        ) : (
          <Flex
            height={"300px"}
            flexDir={"column"}
            gap={"1rem"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Icon fontSize={"6xl"} as={BsCartX}></Icon>
            <Box>The Cart is Empty</Box>
          </Flex>
        )}
        <Flex
          textAlign={"center"}
          padding={"1rem 2rem"}
          fontWeight={"semibold"}
        >
          <Box w={"50%"}>total</Box>
          <Box w={"50%"}>RP {total.toLocaleString("id-ID")},-</Box>
        </Flex>
      </Flex>
    </>
  );
}
