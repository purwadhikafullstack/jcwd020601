import { Box, Container, Flex, Icon, Image, Input } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { AiOutlineBank } from "react-icons/ai";
import { FcAddImage } from "react-icons/fc";
import { api } from "../api/api";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import NotFoundPage from "./NotFoundPage";
import OrderStatus from "../components/OrderStatus";
import OrderCard from "../components/OrderCard";
import OrderAction from "../components/OrderAction";
import Swal from "sweetalert2";

export default function OrderPage() {
  const [order, setOrder] = useState();
  const inputFileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [link, setLink] = useState();
  const [status, setStatus] = useState();
  const locatio = useLocation();
  const location = locatio.pathname.split("/")[2];
  const token = JSON.parse(localStorage.getItem("auth"));

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
      await api().post("/order", formData);

      await api().patch("/order/v2/userstatus", {
        OrderId: order[0].OrderId,
        status: "waiting for payment confirmation",
      });

      Swal.fire(
        "Good job!",
        "Your payment proof has been uploaded.",
        "success"
      );

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
        <OrderStatus status={status} order={order} />
        {/* loading */}
        {isLoading ? (
          <Loading />
        ) : order ? (
          <Flex flexDir={{ base: "column", md: "row" }}>
            <OrderCard order={order} />
            {/* --- */}
            <Flex
              width={{ base: "22rem", md: "35%" }}
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

              {/* Action */}
              <OrderAction
                inputFileRef={inputFileRef}
                status={status}
                order={order}
                fetch={fetch}
              />
            </Flex>
          </Flex>
        ) : (
          <NotFoundPage />
        )}
      </Box>
    </Container>
  );
}
