import { Flex } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProfileSidebar() {
  const locatio = useLocation();
  const location = locatio.pathname.split("/")[1];
  const nav = useNavigate();
  return (
    <>
      <Flex
        boxShadow="0 0 5px #e0e0e0"
        h={"382px"}
        w={"320px"}
        ml={"160px"}
        mt={"80px"}
      >
        <Flex
          w={"100%"}
          p={"40px"}
          flexDir={"column"}
          fontSize={{ base: "1.5rem", xl: "1.5rem", lg: "1.3rem" }}
          fontWeight={"600"}
          gap={"30px"}
        >
          <Flex _hover={{ color: "#0060ae" }} cursor={"pointer"}>
            Pesanan Saya
          </Flex>
          <Flex
            color={location == "profile" ? "#0060ae" : "black"}
            _hover={{ color: "#0060ae" }}
            cursor={"pointer"}
          >
            Akun Saya
          </Flex>
          <Flex _hover={{ color: "#0060ae" }} cursor={"pointer"}>
            WishList Saya
          </Flex>
          <Flex
            _hover={{ color: "#0060ae" }}
            mt={{ base: "20px", xl: "70px", lg: "20px" }}
            w={"100%"}
            cursor={"pointer"}
            onClick={() => nav("/")}
          >
            Back To Home
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
