import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Image,
  Input,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { AiOutlineBank } from "react-icons/ai";
import { FcAddImage } from "react-icons/fc";
import { api } from "../api/api";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import NotFoundPage from "./NotFoundPage";
import ModalCancel from "../components/ModalCancel";
import ModalConfirm from "../components/ModalConfirm";
// import { useSelector } from "react-redux";

export default function OrderPage() {
  const [order, setOrder] = useState();
  const inputFileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [link, setLink] = useState();
  const [status, setStatus] = useState();
  const locatio = useLocation();
  const location = locatio.pathname.split("/")[2];
  const token = JSON.parse(localStorage.getItem("auth"));
  // const [selectFile, setSelectFile] = useState();

  // GET
  async function fetch() {
    try {
      const result = await api().post("orderdetail/id?token=" + token, {
        invoiceCode: location,
      });
      setLink(result.data[0].Order.payment_url);
      setStatus(result.data[0].Order.status);
      setIsLoading(false);
      return setOrder(result.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  // POST Payment
  const handleFile = async (event) => post(event.target.files[0]);

  async function post(file) {
    try {
      const formData = new FormData();
      formData.append("paymentImg", file);
      formData.append("id", order[0].OrderId);
      const pay = await api().post("/order", formData);

      await api().patch("/order/v2/userstatus", {
        OrderId: order[0].OrderId,
        status: "waiting for payment confirmation",
      });

      return fetch();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Container maxW={"size.lg"}>
      <Navbar></Navbar>
      <Box>
        <Flex alignItems={"center"}>
          <Box
            // onClick={() => console.log(order)}
            padding={"1rem 2rem"}
            fontSize={"2xl"}
            fontWeight={"semibold"}
          >
            {order ? `Invoice Code: ${order[0].Order.invoiceCode}` : null}
          </Box>
          <Box
            padding={"0.2rem"}
            border={"3px solid"}
            boxShadow={
              "1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px"
            }
            ringColor={"red"}
            fontWeight={"semibold"}
            fontSize={"1.3rem"}
            color={
              status === "process" || status === "sending"
                ? "green.500"
                : status === "delivery confirm"
                ? "blue.500"
                : status === "waiting for payment confirmation"
                ? "yellow.500"
                : status === "canceled"
                ? "red.500"
                : "gray.900"
            }
          >
            {status
              ?.toLowerCase()
              .split(" ")
              .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
              })
              .join(" ")}
          </Box>
        </Flex>
        {isLoading ? (
          <Loading />
        ) : order ? (
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
                <Flex flexDir={"column"}>
                  <Flex gap={"0.5rem"} fontWeight={"semibold"}>
                    <Box>Shipping</Box>
                    <Box>{order ? order[0].Order.shipping : null}</Box>
                  </Flex>
                  <Flex gap={"0.5rem"} fontWeight={"bold"}>
                    <Box>Total Order Payment</Box>
                    <Box color={"blue.500"}>
                      {order
                        ? order[0].Order.total.toLocaleString("id-ID")
                        : null}
                    </Box>
                  </Flex>
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
                alignItems={"center"}
                padding={"2rem"}
                gap={"2rem"}
                fontWeight={"semibold"}
              >
                <Box fontSize={"xl"} fontWeight={"semibold"}>
                  Payment Proof
                </Box>
                {link ? (
                  <Image
                    // height={"200px"}
                    maxH={"200px"}
                    // onClick={() => inputFileRef.current.click()}
                    src={process.env.REACT_APP_API_IMAGE_URL + link}
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
              </Flex>
              <Flex
                flexDir={"column"}
                boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                borderRadius={"0.7rem"}
              >
                <Flex
                  flexDir={"column"}
                  // justifyContent={"center"}
                  alignItems={"center"}
                  padding={"2rem"}
                  gap={"1rem"}
                  fontWeight={"semibold"}
                >
                  {status === "delivery confirm" || status === "canceled" ? (
                    <Box
                      ringColor={"red"}
                      fontWeight={"semibold"}
                      fontSize={"1.2rem"}
                    >
                      Order Status: {status}
                    </Box>
                  ) : status === "process" ? (
                    <>
                      <Box
                        ringColor={"red"}
                        fontWeight={"semibold"}
                        fontSize={"1.2rem"}
                      >
                        Order Status: {status}
                      </Box>
                      <ModalCancel
                        fetch={fetch}
                        id={order[0].OrderId}
                      ></ModalCancel>
                      {/*  */}
                    </>
                  ) : status === "sending" ? (
                    <>
                      <Box
                        ringColor={"red"}
                        fontWeight={"semibold"}
                        fontSize={"1.2rem"}
                      >
                        Order Status: {status}
                      </Box>
                      <ModalConfirm
                        fetch={fetch}
                        id={order[0].OrderId}
                      ></ModalConfirm>
                      {/*  */}
                    </>
                  ) : (
                    <>
                      <Box
                        ringColor={"red"}
                        fontWeight={"semibold"}
                        fontSize={"1.2rem"}
                      >
                        Order Status: {status}
                      </Box>
                      <Button
                        colorScheme={"blue"}
                        borderRadius={"1.5rem"}
                        width={"100%"}
                        onClick={() => inputFileRef.current.click()}
                      >
                        Upload Payment Proof
                      </Button>
                      {/*  */}
                      <ModalConfirm
                        fetch={fetch}
                        id={order[0].OrderId}
                      ></ModalConfirm>
                      {/*  */}
                      <ModalCancel
                        fetch={fetch}
                        id={order[0].OrderId}
                      ></ModalCancel>
                      {/*  */}
                    </>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <NotFoundPage />
        )}
      </Box>
    </Container>
  );
}
