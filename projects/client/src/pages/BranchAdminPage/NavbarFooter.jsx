import { Box, Image, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { FaInstagram, FaSquareTwitter, FaFacebook } from "react-icons/fa6";
export default function NavbarFooter() {
  return (
    <Box
      display={"flex"}
      borderTop="1px"
      borderTopColor={useColorModeValue("gray.200", "gray.700")}
      h={{ base: "6em" }}
      alignItems={"center"}
      w="100%"
      zIndex={1}
      justifyContent={"center"}
      bottom={0}
      bgColor={"whiteAlpha.700"}
    >
      <Box>
        <Text
          fontSize={{ base: "xl" }}
          color={"grey"}
          textAlign={"center"}
          mx="20px"
        >
          Toko buku online terbesar, terlengkap dan terpercaya di Indonesia
        </Text>
      </Box>
    </Box>
  );
}
