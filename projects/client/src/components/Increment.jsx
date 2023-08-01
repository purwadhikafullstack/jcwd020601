import { Box, Flex, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";

export default function Increment() {
  const [qty, setQty] = useState(1);
  return (
    <Flex alignItems={"center"} gap={"1rem"}>
      <Icon
        fontSize={"2xl"}
        color={"blue.400"}
        as={AiFillMinusCircle}
        cursor={"pointer"}
        onClick={() => {
          if (qty === 1) {
            return setQty(1);
          } else setQty(qty - 1);
        }}
      ></Icon>
      <Box fontSize={"1rem"}>
        {/* <input type="number" defaultValue={qty} /> */}
        {qty}
      </Box>
      <Icon
        fontSize={"2xl"}
        color={"blue.400"}
        as={AiFillPlusCircle}
        cursor={"pointer"}
        onClick={() => {
          setQty(qty + 1);
        }}
      ></Icon>
    </Flex>
  );
}
