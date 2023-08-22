import { Box, Flex, Icon, Image, useToast } from "@chakra-ui/react";
import Increment from "./Increment";
import DeleteModal from "../components/DeleteCart";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { IoStorefrontSharp } from "react-icons/io5";
import { BsCartX } from "react-icons/bs";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";
import Shipping from "./Shipping";

export default function CartBooks(props) {
  const userSelector = useSelector((state) => state.login.auth);
  const orderSelector = useSelector((state) => state.login.order);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [hapus, setHapus] = useState();
  const toast = useToast();

  console.log(orderSelector.BranchId);
  console.log(userSelector.id);

  //GET
  async function fetch() {
    const data = await api().post("/cart/id", {
      UserId: userSelector.id,
      BranchId: orderSelector.BranchId,
    });
    // console.log(data.data.Cart);
    props.setWeight(data.data.weight);
    return setCart(data.data.Cart);
  }

  //PATCH
  async function edit(idx, type) {
    try {
      // console.log(cart[idx].StockId);
      // console.log(cart[idx].id);
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
        boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
        borderRadius={"0.7rem"}
      >
        {/* {console.log(cart[0])} */}
        {cart[0] ? (
          cart.map((val, idx) => (
            <>
              <Flex padding={"1rem"}>
                <Box textAlign={"center"} width={"20%"} fontWeight={"semibold"}>
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
                padding={"1rem 2rem"}
              >
                <Image
                  maxHeight={"100px"}
                  src={val.Stock.Book.book_url}
                ></Image>
                <Flex
                  w={"45%"}
                  flexDir={"column"}
                  justifyContent={"space-evenly"}
                >
                  {/* <Box>Logika Algoritma dan Pemrograman Dasar</Box> */}
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
                {/* seperate */}
                {/* seperate */}
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
                  <Box fontSize={"1rem"}>
                    {/* <input type="number" defaultValue={qty} /> */}
                    {val.quantity}
                  </Box>
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

                  <Flex alignItems={"center"}>
                    {/* Delete */}
                    <DeleteModal setHapus={setHapus} cartId={val.id} />
                  </Flex>
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
          {/* <Box
            // onClick={() => console.log(cart[0].Stock.Book.Discount.discount)}
            onClick={() => console.log(list)}
          >
            KLIK
          </Box> */}
          <Box w={"50%"}>total</Box>
          <Box w={"50%"}>RP {total.toLocaleString("id-ID")},-</Box>
        </Flex>
      </Flex>
    </>
  );
}
