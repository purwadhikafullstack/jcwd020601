import {
  Box,
  Center,
  Text,
  Image,
  List,
  ListItem,
  ListIcon,
  Button,
  OrderedList,
  UnorderedList,
  useToast,
  Input,
  Flex,
} from "@chakra-ui/react";
import { MdCheckCircle, MdSettings } from "react-icons/md";
import icon from "../assets/images/icon.png";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import tooFarModal from "./TooFarModal";

export default function DetailBookPage() {
  const IMG = process.env.REACT_APP_API_IMAGE_URL;
  console.log(IMG);
  const orderSelector = useSelector((state) => state.login.order);
  const userSelector = useSelector((state) => state.login.auth);
  const toast = useToast();
  const nav = useNavigate();
  const { id } = useParams();
  const [value, setValue] = useState([]);
  const [qty, setQty] = useState(1);
  async function fetchProduct() {
    let response = await api().get(`/stock/${parseInt(id)}`);
    setValue(response.data);
    console.log(response);
  }
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // console.log(value.Book?.title);
  // console.log(value.Book);
  // console.log(value);

  // Add to Cart
  async function add() {
    try {
      if (userSelector.username) {
        await api().post("cart/v1", {
          qty: qty,
          UserId: userSelector.id,
          StockId: value.id,
        });
        nav("/cart");
      } else {
        Swal.fire("You need to login first?", "", "question");
        nav("/login");
      }
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
      console.error(error);
    }
  }
  const percent = (a, b) => {
    let result = (a / 100) * b;
    return result;
  };
  console.log(value.Book?.book_url);
  console.log(value.Book?.title);
  return (
    <>
      <Center my={3} display={"flex"} flexDirection={"column"}>
        <Box
          maxW={"1200px"}
          display={"flex"}
          p={3}
          gap={3}
          flexDirection={{
            base: "column",
            sm: "column",
            md: "column",
            lg: "row",
            xl: "row",
          }}
          alignItems={{
            base: "center",
            sm: "normal",
            md: "normal",
            lg: "normal",
            xl: "normal",
          }}
        >
          <Box
            maxW={"300px"}
            justifyContent={"center"}
            display={"flex"}
            px={10}
            py={3}
          >
            <Box>
              {value.Discount?.discount ? (
                <>
                  {value.Discount?.isPercent ? (
                    <>
                      <Box
                        w={14}
                        h={8}
                        marginLeft={"150px"}
                        borderTopRightRadius={"5px"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgColor={"blue.100"}
                      >
                        <Text color={"blue.900"}>
                          -{value.Discount?.discount}%
                        </Text>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box
                        w={20}
                        h={8}
                        borderTopRightRadius={"5px"}
                        marginLeft={"50px"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgColor={"blue.100"}
                      >
                        <Text fontSize="md">
                          {Intl.NumberFormat().format(
                            "-" + value.Discount?.discount
                          )}
                        </Text>
                      </Box>
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
              <Image
                src={process.env.REACT_APP_API_IMAGE_URL + value.Book?.book_url}
                width={"200"}
                height={"200px"}
              />
            </Box>
          </Box>
          <Box
            maxW={"600px"}
            gap={5}
            display={"flex"}
            flexDirection={"column"}
            p={3}
          >
            <Box display={"flex"} flexDirection={"column"} gap={3}>
              <Text fontSize={"md"} color="#4A5568" as={"i"}>
                {value.Book?.author}
              </Text>
              <Text fontSize={"2xl"} fontWeight={"bold"}>
                {value.Book?.title}
              </Text>
            </Box>
            <Box display={"flex"} gap={3} flexDirection={"column"}>
              <Text color="blue.600" fontSize="md">
                <Text fontSize="xl" color="blue.600">
                  {value.Discount?.discount ? (
                    <>
                      {value.Discount?.isPercent ? (
                        <>
                          <Box gap={3} display={"flex"} flexDir={"column"}>
                            <Text
                              fontSize="md"
                              my={0}
                              as={"del"}
                              color={"blackAlpha.500"}
                            >
                              Rp.{Intl.NumberFormat().format(value.Book?.price)}
                            </Text>
                            <Text fontSize="xl">
                              Rp.
                              {Intl.NumberFormat().format(
                                value.Book?.price -
                                  percent(
                                    value.Discount?.discount,
                                    value.Book?.price
                                  )
                              )}
                            </Text>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box gap={2} display={"flex"} flexDir={"column"}>
                            <Text
                              fontSize="md"
                              my={0}
                              as={"del"}
                              color={"blackAlpha.500"}
                            >
                              Rp.{" "}
                              {Intl.NumberFormat().format(value.Book?.price)}
                            </Text>
                            <Text fontSize="xl">
                              Rp.{" "}
                              {Intl.NumberFormat().format(
                                value.Book?.price - value.Discount?.discount
                              )}
                            </Text>
                          </Box>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Text fontSize="xl">
                        Rp. {Intl.NumberFormat().format(value.Book?.price)}
                      </Text>
                    </>
                  )}
                </Text>
              </Text>
            </Box>
            <Box display={"flex"} gap={5} flexDirection={"column"}>
              <Text fontWeight={"semibold"} fontSize={"lg"}>
                Informasi Toko
              </Text>
              <Box display={"flex"} gap={15}>
                <Text>Toko {value.Branch?.name}</Text>
                <Text>Kota {value.Branch?.city}</Text>
                <Text>Provinsi {value.Branch?.province}</Text>
              </Box>
            </Box>
            <Box display={"flex"} flexDirection={"column"} gap={5}>
              <Text fontWeight={"semibold"} fontSize={"lg"}>
                Deskripsi Buku
              </Text>
              <Text>Deskripsi : {value.Book?.description}</Text>
            </Box>
            <Box display={"flex"} flexDirection={"column"} gap={5}>
              <Text fontWeight={"semibold"} fontSize={"lg"}>
                Detail Buku
              </Text>
              <Box display={"flex"} gap={10}>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="blue.500" />
                    Bahasa: {value.Book?.language}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="blue.500" />
                    Tanggal_Publish :{" "}
                    {value.Book?.publish_date
                      ? new Date(value.Book.publish_date).getFullYear()
                      : " "}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="blue.500" />
                    Penerbit : {value.Book?.publisher}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="blue.500" />
                    Jumlah_Halaman : {value.Book?.pages}
                  </ListItem>
                </List>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="blue.500" />
                    Berat : {value.Book?.weight}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="blue.500" />
                    Dimensi : {value.Book?.dimension}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="blue.500" />
                    Stok : {value.stock}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="blue.500" />
                    Rating : {value.Book?.rating}
                  </ListItem>
                </List>
              </Box>
            </Box>
          </Box>
          <Flex flexDir={"column"} gap={3}>
            <Box>
              <Input
                width={"4rem"}
                type="number"
                defaultValue={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              ></Input>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={5}
              alignItems={"center"}
            >
              <Text fontWeight={"semibold"} fontSize={"lg"}>
                Sub Total :
              </Text>
              <Text fontWeight={"semibold"} fontSize={"lg"} color={"blue.600"}>
                {value.Discount?.discount ? (
                  <>
                    {value.Discount?.isPercent ? (
                      <>
                        <Box gap={3} display={"flex"} flexDir={"column"}>
                          <Text fontSize="xl">
                            Rp.
                            {Intl.NumberFormat().format(
                              value.Book?.price -
                                percent(
                                  value.Discount?.discount,
                                  value.Book?.price
                                )
                            )}
                          </Text>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box gap={3} display={"flex"} flexDir={"column"}>
                          <Text fontSize="xl">
                            Rp.{" "}
                            {Intl.NumberFormat().format(
                              value.Book?.price - value.Discount?.discount
                            )}
                          </Text>
                        </Box>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Text fontSize="xl">
                      Rp. {Intl.NumberFormat().format(value.Book?.price)}
                    </Text>
                  </>
                )}
              </Text>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"} gap={5}>
              <Button
                variant="solid"
                colorScheme="blue"
                onClick={
                  orderSelector.TooFar
                    ? () => tooFarModal.onOpen()
                    : () => add()
                }
              >
                Add to Cart
              </Button>
            </Box>
          </Flex>
        </Box>
      </Center>
    </>
  );
}
