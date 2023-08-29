import {
  Box,
  Container,
  Flex,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Th,
  useToast,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CartBooks from "../components/CartBooks";
import Shipping from "../components/Shipping";
import AlertOrder from "../components/AlertOrder";

export default function CartPage() {
  const toast = useToast();
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.login.auth);
  const orderSelector = useSelector((state) => state.login.order);
  const nav = useNavigate();
  const [total, setTotal] = useState(0);
  const [weight, setWeight] = useState();
  const [courier, setCourier] = useState();
  const [shipping, setShipping] = useState(0);
  const [totalOr, setTotalOr] = useState(0);

  useEffect(() => {
    setTotalOr(Number(total) + Number(shipping));
  }, [total, shipping]);

  async function create() {
    try {
      const result = await api().post("order/v1", {
        UserId: userSelector.id,
        BranchId: orderSelector.BranchId,
        AddressId: orderSelector.AddressId,
        shipping: Number(shipping),
        courier,
      });
      dispatch({
        type: "qty",
        payload: {
          quantity: 0,
        },
      });
      return nav("/order/" + result.data.invoiceCode);
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        position: "top",
        containerStyle: {
          maxWidth: "30%",
        },
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Container maxW={"size.xl"}>
      <Navbar></Navbar>
      <Box>
        <Box padding={"1rem 2rem"} fontSize={"2xl"} fontWeight={"semibold"}>
          Cart
        </Box>
        <Flex
          flexWrap={"wrap"}
          flexDir={{ base: "column", md: "row" }}
          alignItems={{ base: "center", md: "start" }}
          justifyContent={"center"}
        >
          <Flex
            width={{ base: "22rem", lg: "65%" }}
            flexDir={"column"}
            gap={"1rem"}
            padding={" 1rem 2rem"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <CartBooks setWeight={setWeight} setTotal={setTotal}></CartBooks>
          </Flex>
          <Flex
            width={{ base: "22rem", lg: "35%" }}
            flexDir={"column"}
            gap={"1rem"}
            padding={"1rem 2rem"}
          >
            {/* Shipping */}
            <Shipping
              setShipping={setShipping}
              shipping={shipping}
              weight={weight}
              total={total}
              setCourier={setCourier}
              courier={courier}
              BranchId={orderSelector.BranchId}
              AddressId={orderSelector.AddressId}
            ></Shipping>
            {/* Shipping */}
            <Flex
              flexDir={"column"}
              boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
              borderRadius={"0.7rem"}
              padding={"0.5rem"}
            >
              <Box
                padding={"1rem"}
                textAlign={"center"}
                fontSize={"xl"}
                fontWeight={"semibold"}
              >
                Order Details
              </Box>
              <Flex
                flexDir={"column"}
                alignItems={"center"}
                padding={"1rem"}
                gap={"2rem"}
                fontWeight={"semibold"}
              >
                <Flex gap={"1rem"}>
                  <TableContainer>
                    <Table size={{ base: "sm", lg: "md" }} variant="simple">
                      <Tbody>
                        <Th>Payment Summary</Th>
                        <Tr>
                          <Td>Price</Td>
                          <Td>Rp {total.toLocaleString("id-ID")},-</Td>
                        </Tr>
                        <Tr>
                          <Td>Shipping</Td>
                          <Td>
                            Rp {Number(shipping).toLocaleString("id-ID")},-
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>Total</Td>
                          <Td>Rp {totalOr.toLocaleString("id-ID")},-</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Flex>
                <AlertOrder create={create} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
}
