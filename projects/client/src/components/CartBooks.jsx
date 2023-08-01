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
  const [qty, setQty] = useState(1);
  const [total, setTotal] = useState(0);
  const [hapus, setHapus] = useState();

  //GET
  async function fetch() {
    const data = await api.get("cart/" + userSelector.id);
    return setCart(data.data);
  }

  //PATCH
  async function edit(idx, param) {
    try {
      const stock = await api.get("stock/" + cart[idx].StockId);

      if (stock.stock < param) {
        setQty(param - 1);
        return alert("Insufficient");
      } else if (param <= 0) {
        setQty(param + 1);
        return alert(
          "Unable to order less than 1 product, please delete instead"
        );
      } else {
        const kuant = await api.post("cart/v1", {
          StockId: cart[idx].StockId,
          UserId: cart[idx].UserId,
          quantity: param,
        });
        await fetch();
        return console.log(kuant.data);
      }
    } catch (error) {
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
                  <Box>{`Rp ${val.Stock?.Book?.price}`}</Box>
                </Flex>
                {/* seperate */}
                {/* seperate */}
                <Flex alignItems={"center"} gap={"1rem"}>
                  <Icon
                    fontSize={"2xl"}
                    color={"blue.400"}
                    as={AiFillMinusCircle}
                    cursor={"pointer"}
                    onClick={async () => {
                      setQty(qty - 1);
                      await edit(idx, qty);
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
                    onClick={async () => {
                      setQty(qty + 1);
                      await edit(idx, qty);
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
