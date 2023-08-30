import { Box, Flex, Image } from "@chakra-ui/react";

export default function OrderCard(props) {
  const order = props.order;
  return (
    <Flex
      width={{ base: "22rem", md: "65%" }}
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
              flexDir={{ base: "column", md: "row" }}
              gap={{ base: "1rem", md: "0rem" }}
              borderBottom={{ base: "1px grey solid", md: "none" }}
            >
              <Image
                maxHeight={"100px"}
                src={
                  process.env.REACT_APP_API_IMAGE_URL + val.Stock.Book.book_url
                }
              ></Image>
              {/* <Flex> */}
              <Flex
                w={{ base: "auto", md: "45%" }}
                flexDir={"column"}
                justifyContent={"space-evenly"}
              >
                <Box fontWeight={"semibold"}>{val.Stock.Book.title}</Box>
                <Box>
                  {val.Stock.Book.author} -{" "}
                  {val.Stock.Book.publish_date.slice(0, 4)}
                </Box>
                <Box>{`${val.Stock?.Book?.weight} gr`}</Box>
                <Box fontWeight={"semibold"}>{`X ${val.quantity}`}</Box>
              </Flex>
              <Flex>{`Rp ${val.price.toLocaleString("id-ID")},-`}</Flex>
              {/* </Flex> */}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}
