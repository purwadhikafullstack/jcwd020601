import { Flex } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProfileSidebar(props) {
  const locatio = useLocation();
  const location = locatio.pathname.split("/")[1];
  const nav = useNavigate();
  return (
    <>
      <Flex
        mb={"100px"}
        boxShadow="0 0 5px #e0e0e0"
        h={"382px"}
        pr={{
          base: "20px",
          sm: "20px",
          md: "20px",
          lg: "50px",
          xl: "100px",
          "2xl": "100px",
        }}
        ml={{
          base: "20px",
          sm: "20px",
          md: "20px",
          lg: "50px",
          xl: "80px",
          "2xl": "100px",
        }}
        mt={"80px"}
      >
        <Flex
          w={"100%"}
          p={{
            base: "20px",
            sm: "20px",
            md: "20px",
            lg: "20px",
            xl: "20px",
            "2xl": "20px",
          }}
          flexDir={"column"}
          fontSize={{
            base: "1rem",
            sm: "1.2rem",
            md: "1.5rem",
            lg: "1.5rem",
            xl: "1.5rem",
            "2xl": "1.5rem",
          }}
          fontWeight={"600"}
          gap={"30px"}
        >
          <Flex
            _hover={{ color: "#0060ae" }}
            color={location == "orders" ? "#0060ae" : "black"}
            cursor={"pointer"}
            onClick={() => props.setSideTab("myOrders")}
          >
            Pesanan Saya
          </Flex>
          <Flex
            color={location == "profile" ? "#0060ae" : "black"}
            _hover={{ color: "#0060ae" }}
            cursor={"pointer"}
            onClick={() => props.setSideTab("myAccount")}
          >
            Akun Saya
          </Flex>

          <Flex
            _hover={{ color: "#0060ae" }}
            mt={{
              base: "40px",
              sm: "40px",
              md: "40px",
              lg: "70px",
              xl: "100px",
              "2xl": "100px",
            }}
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
