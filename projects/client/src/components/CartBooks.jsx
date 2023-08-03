import { Box, Flex, Icon, Image, propNames } from "@chakra-ui/react";
import Increment from "./Increment";
import DeleteModal from "../components/DeleteCart";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { IoStorefrontSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";

export default function CartBooks(props) {
  const userSelector = useSelector((state) => state.login.auth);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [hapus, setHapus] = useState();

  //GET
  async function fetch() {
    const data = await api.get("cart/" + userSelector.id);
    return setCart(data.data);
  }

  //PATCH
  async function edit(idx, type) {
    try {
      // console.log(cart[idx].StockId);
      // console.log(cart[idx].id);
      await api.patch("cart/v2", {
        StockId: cart[idx].StockId,
        UserId: cart[idx].UserId,
        id: cart[idx].id,
        type: type,
      });
      await fetch();
    } catch (error) {
      alert(error.response.data);
      console.error("Error in edit():", error);
    }
  }

  // Total Order Price
  const totalPrice = cart.reduce((prev, curr) => {
    const { price } = curr.Stock.Book;
    const { quantity } = curr;
    const total = price * quantity;
    return prev + total;
  }, 0);
  // console.log(total);

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    fetch();
  }, [hapus]);

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
        {cart.map((val, idx) => {
          return (
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
                {/* {cart.quantity} */}
                {/* seperate */}
                {/* seperate */}
                <Flex flexDir={"column"} gap={"8px"}>
                  {/* <Box>Rp 180.000</Box> */}
                  <Box>
                    Rp{" "}
                    {(val.Stock?.Book?.price * val.quantity).toLocaleString(
                      "id-ID"
                    )}
                    ,-
                  </Box>
                  <Flex alignItems={"center"}>
                    {/* Delete */}
                    <DeleteModal setHapus={setHapus} cartId={val.id} />
                  </Flex>
                </Flex>
              </Flex>
            </>
          );
        })}
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
