import { Center, Flex } from "@chakra-ui/react";

export default function TabBar(props) {
  return (
    <Flex mt={"80px"} h={"48px"} borderBottom={"1px #e0e0e0 solid"}>
      <Flex>
        <Center
          w={"350px"}
          fontSize={{
            base: "0.8rem",
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
            props.tab == "biodata" ? "2px red solid" : "1px black solid"
          }
          fontWeight={"500"}
          onClick={() => {
            props.setTab("biodata");
          }}
        >
          Biodata
        </Center>
      </Flex>
      <Flex>
        <Center
          w={"350px"}
          whiteSpace={"nowrap"}
          fontSize={{
            base: "0.8rem",
            sm: "1rem",
            md: "1rem",
            lg: "1rem",
            xl: "1.2rem",
            "2xl": "1.3rem",
          }}
          textAlign={"center"}
          cursor={"pointer"}
          fontWeight={"500"}
          py={"10px"}
          px={{
            base: "40px",
            sm: "60px",
            md: "70px",
            lg: "100px",
            xl: "130px",
            "2xl": "170px",
          }}
          borderBottom={
            props.tab == "daftarAlamat" ? "2px red solid" : "1px black solid"
          }
          onClick={() => {
            props.setTab("daftarAlamat");
          }}
        >
          Daftar Alamat
        </Center>
      </Flex>
    </Flex>
  );
}
