import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Image,
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
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/api";
import CartBooks from "../components/CartBooks";
import { useNavigate } from "react-router-dom";
import Shipping from "../components/Shipping";
import { useSelector } from "react-redux";

export default function CartPage() {
  const userSelector = useSelector((state) => state.login.auth);
  const orderSelector = useSelector((state) => state.login.order);
  const nav = useNavigate();
  // const [edit, setEdit] = useState(false);
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [total, setTotal] = useState(0);
  const [weight, setWeight] = useState();
  const [courier, setCourier] = useState();
  const [shipping, setShipping] = useState(0);
  const [totalOr, setTotalOr] = useState(0);

  useEffect(() => {
    setTotalOr(Number(total) + Number(shipping));
  }, [shipping]);

  async function create() {
    await api.post("order/v1", {
      UserId: userSelector.id,
      BranchId: orderSelector.BranchId,
      AddressId: orderSelector.AddressId,
      shipping: Number(shipping),
      courier,
    });
    return nav("/order");
  }

  return (
    <Container maxW={"size.lg"}>
      <Navbar></Navbar>
      <Box>
        <Box padding={"1rem 2rem"} fontSize={"2xl"} fontWeight={"semibold"}>
          Cart
        </Box>
        <Flex flexWrap={"wrap"}>
          <Flex
            width={"65%"}
            flexDir={"column"}
            gap={"1rem"}
            padding={" 1rem 2rem"}
          >
            <CartBooks setWeight={setWeight} setTotal={setTotal}></CartBooks>
          </Flex>
          <Flex
            width={"35%"}
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
            ></Shipping>
            {/* Shipping */}
            <Flex
              flexDir={"column"}
              boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
              borderRadius={"0.7rem"}
            >
              <Box padding={"2rem"} fontSize={"xl"} fontWeight={"semibold"}>
                Order Details
              </Box>
              <Flex
                flexDir={"column"}
                // justifyContent={"center"}
                alignItems={"center"}
                padding={"2rem"}
                gap={"2rem"}
                fontWeight={"semibold"}
              >
                <Flex gap={"1rem"}>
                  {/* <Box>Payment Summary</Box>
                  <Box color={"blue.500"} fontWeight={"bold"}>
                    Rp {total.toLocaleString("id-ID")},-
                  </Box> */}
                  <TableContainer>
                    <Table variant="simple">
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
                {/* <Button
                  colorScheme={"blue"}
                  borderRadius={"1.5rem"}
                  width={"100%"}
                  // isDisabled={true}
                  onClick={create}
                >
                  Create Order
                </Button> */}
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
        // isDisabled={true}

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

{
  /* <Flex
              boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
              padding={"1rem 2rem"}
              borderRadius={"0.7rem"}
              justifyContent={"end"}
            >
              {edit ? (
                <Flex
                  justifyContent={"space-between"}
                  width={"100%"}
                  alignItems={"center"}
                >
                  <Flex alignItems={"center"} gap={"0.3rem"}>
                    <input
                      style={{ width: "1.2rem", height: "1.2rem" }}
                      type={"checkbox"}
                    />
                    <Box>Select All</Box>
                  </Flex>
                  <Flex gap={"6px"}>
                    <Button>Delete</Button>
                    <Button
                      colorScheme={"blue"}
                      onClick={() => {
                        setEdit(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </Flex>
              ) : (
                <Box
                  fontWeight={"semibold"}
                  cursor={"pointer"}
                  _hover={{ color: "blue.400" }}
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  Edit Cart
                </Box>
              )}
            </Flex> */
}
