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
} from "@chakra-ui/react";
// import {  } from "@chakra-ui/icons";
import { MdCheckCircle, MdSettings } from "react-icons/md";
import icon from "../assets/images/icon.png";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import BookCardRecomend from "./BookCardRecomend";

export default function DetailBookPage() {
  const { id } = useParams();
  const [param, useParam] = useState(parseInt(id));
  const [value, setValue] = useState([]);
  async function fetchProduct() {
    let response = await api.get(`/stock/${param}`);
    setValue(response.data);
    console.log(response);
  }
  useEffect(() => {
    fetchProduct();
  }, [param]);
  // console.log(value.Book?.title);
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
            base: "normal",
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
            <Image src={value.Book?.book_url} width={"200"} height={"200px"} />
          </Box>
          <Box
            maxW={"600px"}
            gap={5}
            display={"flex"}
            flexDirection={"column"}
            p={3}
          >
            <Box display={"flex"} flexDirection={"column"} gap={3}>
              <Text fontSize={"md"} color={"#6d6d6d"}>
                {value.Book?.author}
              </Text>
              <Text fontSize={"2xl"} fontWeight={"bold"}>
                {value.Book?.title}
              </Text>
            </Box>
            <Box display={"flex"} gap={3}>
              <Text fontSize={"xl"} color={"blue.600"} fontWeight={"semibold"}>
                Rp. {value.Book?.price}
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
          <Box maxW={"300px"} p={5}>
            <Box display={"flex"} flexDirection={"column"} p={3} gap={3}>
              <Box display={"flex"} flexDirection={"column"} gap={3}>
                <Text fontSize={"md"} color={"#6d6d6d"}>
                  Ingin Beli Berapa ?
                </Text>
                <Text fontWeight={"semibold"} fontSize={"lg"}>
                  Jumlah Barang
                </Text>
              </Box>
              <Box display={"flex"} my={3} alignItems={"center"} gap={3}>
                <MdSettings />
                <Text>1</Text>
                <MdSettings />
              </Box>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Text fontWeight={"semibold"} fontSize={"lg"}>
                  Sub Total
                </Text>
                <Text
                  fontWeight={"semibold"}
                  fontSize={"lg"}
                  color={"blue.600"}
                >
                  Rp. 74.000
                </Text>
              </Box>
              <Box display={"flex"} justifyContent={"space-between"} gap={5}>
                <Button variant="solid" colorScheme="blue">
                  Keranjang
                </Button>
                <Button variant="solid" colorScheme="blue">
                  Beli
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Center>
    </>
  );
}
