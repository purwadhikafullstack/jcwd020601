import {
  Box,
  Flex,
  Grid,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";

export default function MenuKategori(props) {
  return (
    <>
      <Menu>
        <MenuButton onClick={props.handleTrans}>
          <Flex alignItems={"center"} gap={"1rem"}>
            <Text
              fontWeight={"bold"}
              fontSize={{ sm: "md", md: "xl" }}
              color={"blue.700"}
              display={{
                base: "none",
                sm: "none",
                md: "none",
                lg: "none",
                xl: "block",
              }}
            >
              Kategori
            </Text>
            <Icon
              as={BsChevronDown}
              style={
                props.trans
                  ? {
                      color: "blue",
                      fontSize: "25px",
                      transform: "rotate(0deg)",
                      transition: "transform 150ms ease",
                    }
                  : {
                      color: "blue",
                      fontSize: "25px",
                      transform: "rotate(180deg)",
                      transition: "transform 150ms ease",
                    }
              }
            />
          </Flex>
        </MenuButton>
        <MenuList
          my={"19px"}
          w={{
            base: "0",
            sm: "0",
            md: "48em",
            lg: "70em",
            xl: "93em",
          }}
          position={"fixed"}
          left={{
            base: "0",
            sm: "0",
            md: "-12em",
            lg: "-15em",
            xl: "-20em",
          }}
          boxShadow="0px 5px 10px skyblue"
        >
          <Flex justifyContent={"space-between"}>
            <Flex
              flexDir={"column"}
              fontSize={"xl"}
              borderRightColor={"blue.700"}
              pr={"20px"}
              maxH={"200px"}
              overflowY={"scroll"}
              sx={{
                "&::-webkit-scrollbar": {
                  width: "5px",
                  borderRadius: "8px",
                  backgroundColor: `rgba(0, 0, 0, 0.05)`,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: `#cce6ff`,
                },
              }}
            >
              {props.category.map((val) => (
                <Flex
                  onClick={() => {
                    props.nav(`/products/filter/${val.id}`);
                  }}
                >
                  <Text
                    cursor={"pointer"}
                    w={"15em"}
                    p={"10px"}
                    pl={"30px"}
                    _hover={{ bgColor: "#BEE3F8", color: "#2C5282" }}
                  >
                    {val.category}
                  </Text>
                </Flex>
              ))}
            </Flex>
            <Box>
              <Grid templateColumns="repeat(2, 1fr)" gap={3}></Grid>
            </Box>
          </Flex>
        </MenuList>
      </Menu>
    </>
  );
}
