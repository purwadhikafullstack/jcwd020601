import { Center, Flex } from "@chakra-ui/react";

export default function TabBar(props) {
  return (
    <Flex mt={"80px"} h={"48px"} borderBottom={"1px #e0e0e0 solid"}>
      <Flex>
        <Center
          fontSize={{
            base: "0.8rem",
            sm: "1rem",
            md: "1rem",
            lg: "1rem",
            xl: "1rem",
            "2xl": "1rem",
          }}
          py={"10px"}
          px={{
            base: "30px",
            sm: "20px",
            md: "30px",
            lg: "50px",
            xl: "70px",
            "2xl": "100px",
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
          fontSize={{
            base: "0.8rem",
            sm: "1rem",
            md: "1rem",
            lg: "1rem",
            xl: "1rem",
            "2xl": "1rem",
          }}
          textAlign={"center"}
          cursor={"pointer"}
          fontWeight={"500"}
          py={"10px"}
          px={{
            base: "30px",
            sm: "20px",
            md: "20px",
            lg: "50px",
            xl: "70px",
            "2xl": "100px",
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
      <Flex>
        <Center
          cursor={"pointer"}
          fontSize={{
            base: "0.8rem",
            sm: "1rem",
            md: "1rem",
            lg: "1rem",
            xl: "1rem",
            "2xl": "1rem",
          }}
          fontWeight={"500"}
          py={"10px"}
          px={{
            base: "30px",
            sm: "20px",
            md: "30px",
            lg: "50px",
            xl: "70px",
            "2xl": "100px",
          }}
          borderBottom={
            props.tab == "pembayaran" ? "2px red solid" : "1px black solid"
          }
          onClick={() => {
            props.setTab("pembayaran");
          }}
        >
          Pembayaran
        </Center>
      </Flex>
    </Flex>
  );
}
