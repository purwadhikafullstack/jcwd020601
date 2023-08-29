import { Center, Flex } from "@chakra-ui/react";

export default function TabBar(props) {
  return (
    <Flex
      mt={{
        base: "30px",
        sm: "30px",
        md: "40px",
        lg: "50px",
        xl: "70px",
        "2xl": "80px",
      }}
      h={"48px"}
      borderBottom={"1px #e0e0e0 solid"}
    >
      <Flex>
        <Center
          w={{
            base: "180px",
            sm: "200px",
            md: "230px",
            lg: "270px",
            xl: "300px",
            "2xl": "400px",
          }}
          fontSize={{
            base: "1rem",
            sm: "1rem",
            md: "1rem",
            lg: "1rem",
            xl: "1.2rem",
            "2xl": "1.3rem",
          }}
          py={"10px"}
          px={{
            base: "40px",
            sm: "60px",
            md: "70px",
            lg: "100px",
            xl: "130px",
            "2xl": "170px",
          }}
          cursor={"pointer"}
          borderBottom={
            props.tab == "Pending" ? "2px red solid" : "1px black solid"
          }
          fontWeight={"500"}
          onClick={() => {
            props.setTab("Pending");
          }}
        >
          Pending
        </Center>
      </Flex>
      <Flex>
        <Center
          w={{
            base: "180px",
            sm: "200px",
            md: "230px",
            lg: "270px",
            xl: "300px",
            "2xl": "400px",
          }}
          fontSize={{
            base: "1rem",
            sm: "1rem",
            md: "1rem",
            lg: "1rem",
            xl: "1.2rem",
            "2xl": "1.4rem",
          }}
          textAlign={"center"}
          cursor={"pointer"}
          fontWeight={"500"}
          py={"10px"}
          px={{
            base: "30px",
            sm: "40px",
            md: "60px",
            lg: "100px",
            xl: "130px",
            "2xl": "170px",
          }}
          borderBottom={
            props.tab == "History" ? "2px red solid" : "1px black solid"
          }
          onClick={() => {
            props.setTab("History");
          }}
        >
          History
        </Center>
      </Flex>
    </Flex>
  );
}
