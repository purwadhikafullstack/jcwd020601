import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Center,
  Image,
  Input,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineDown, AiOutlineBank } from "react-icons/ai";
import { FcAddImage } from "react-icons/fc";
import { api } from "../api/api";
import { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";

export default function OrderPage() {
  const [order, setOrder] = useState();
  const inputFileRef = useRef(null);

  const [link, setLink] = useState();
  // const [selectFile, setSelectFile] = useState();

  // GET
  async function fetch() {
    try {
      const result = await api.post("orderdetail/id", {
        OrderId: 30,
      });
      setLink(result.data[0].Order.payment_url);
      return setOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  // POST Payment
  const handleFile = async (event) => post(event.target.files[0]);
  async function post(file) {
    try {
      const formData = new FormData();
      formData.append("paymentImg", file);
      formData.append("id", 30); // TEMBAK
      await api.post("/order", formData);
      await api.patch("/order/v2/status", {
        OrderId: 30,
        status: "waiting for payment confirmation",
      });
      return fetch();
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect(async () => {
  //   const get = await api.get("/order/20");
  //   return setUpload(get.data.payment_url);
  // }, []);

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Container maxW={"size.lg"}>
      <Navbar></Navbar>
      <Box>
        <Box padding={"1rem 2rem"} fontSize={"2xl"} fontWeight={"semibold"}>
          OrderID: onfd8762cv
        </Box>
        <Flex>
          <Flex
            width={"65%"}
            flexDir={"column"}
            gap={"1rem"}
            padding={" 1rem 2rem"}
          >
            <Flex
              boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
              padding={"1rem 2rem"}
              borderRadius={"0.7rem"}
              flexDir={"column"}
              justifyContent={"center"}
              gap={"1rem"}
            >
              {order?.map((val) => {
                return (
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
                      <Box>{val.Stock.Book.title}</Box>
                      <Box>
                        {val.Stock.Book.author} -{" "}
                        {val.Stock.Book.publish_date.slice(0, 4)}
                      </Box>
                      <Box>{`${val.Stock?.Book?.weight} gr`}</Box>
                      <Box fontWeight={"semibold"}>{`X ${val.quantity}`}</Box>
                    </Flex>
                    {/* seperate */}
                    {/* seperate */}

                    <Flex
                      flexDir={"column"}
                      gap={"8px"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {`Rp ${val.price.toLocaleString("id-ID")},-`}
                    </Flex>
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
          <Flex
            width={"35%"}
            padding={"1rem 2rem"}
            flexDir={"column"}
            gap={"1rem"}
          >
            <Flex
              boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
              padding={"1rem 2rem"}
              borderRadius={"0.7rem"}
              flexDir={"column"}
              gap={"1rem"}
            >
              <Flex fontWeight={"bold"} gap={"0.5rem"}>
                <Box>Total Order Payment</Box>
                <Box color={"blue.500"}>
                  {order ? order[0].Order.total.toLocaleString("id-ID") : null}
                </Box>
              </Flex>
              <Flex fontStyle={"italic"}>
                Complete the payment and upload the payment proof
              </Flex>
              <Box fontWeight={"semibold"}>
                <Icon as={AiOutlineBank}></Icon> BCA 11223456789
              </Box>
            </Flex>
            <Flex
              flexDir={"column"}
              boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
              borderRadius={"0.7rem"}
            >
              <Box padding={"2rem"} fontSize={"xl"} fontWeight={"semibold"}>
                Upload Payment Proof
              </Box>
              <Flex
                flexDir={"column"}
                // justifyContent={"center"}
                alignItems={"center"}
                padding={"2rem"}
                gap={"2rem"}
                fontWeight={"semibold"}
              >
                {link ? (
                  <Image
                    // height={"200px"}
                    maxH={"200px"}
                    // onClick={() => inputFileRef.current.click()}
                    src={link}
                  ></Image>
                ) : (
                  <Icon
                    fontSize={"8xl"}
                    as={FcAddImage}
                    cursor={"pointer"}
                  ></Icon>
                )}

                <Input
                  display={"none"}
                  ref={inputFileRef}
                  type="file"
                  onChange={handleFile}
                ></Input>
                <Button
                  colorScheme={"blue"}
                  borderRadius={"1.5rem"}
                  width={"100%"}
                  onClick={() => inputFileRef.current.click()}
                >
                  Upload Payment Proof
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
}
