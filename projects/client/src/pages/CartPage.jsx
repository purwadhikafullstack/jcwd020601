import {
  Box,
  Button,
  Container,
  Flex,
  useDisclosure,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Th,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/api";
import CartBooks from "../components/CartBooks";
import { useNavigate } from "react-router-dom";
import Shipping from "../components/Shipping";
import { useSelector } from "react-redux";

export default function CartPage() {
  const toast = useToast();
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
  }, [shipping]);

  async function create() {
    try {
      const result = await api().post("order/v1", {
        UserId: userSelector.id,
        BranchId: orderSelector.BranchId,
        AddressId: orderSelector.AddressId,
        shipping: Number(shipping),
        courier,
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

function AlertOrder(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <Button
        colorScheme={"blue"}
        borderRadius={"1.5rem"}
        width={"100%"}
        onClick={onOpen}
      >
        Create Order
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Create Order
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Check
              </Button>
              <Button colorScheme="blue" onClick={props.create} ml={3}>
                Create
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
