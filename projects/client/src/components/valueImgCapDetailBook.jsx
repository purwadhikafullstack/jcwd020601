import { Box, Text, Image, List, ListItem, ListIcon } from "@chakra-ui/react";
import { MdCheckCircle, MdSettings } from "react-icons/md";
export default function ValueImgCapDetailBook({ value, percent }) {
  return (
    <>
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
                    <Text color={"blue.900"}>-{value.Discount?.discount}%</Text>
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
                          Rp. {Intl.NumberFormat().format(value.Book?.price)}
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
                <Text fontSize="xl">
                  Rp. {Intl.NumberFormat().format(value.Book?.price)}
                </Text>
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
    </>
  );
}
