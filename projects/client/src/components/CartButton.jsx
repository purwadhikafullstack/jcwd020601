import { Box, Flex, Icon, Menu, MenuButton, Text } from "@chakra-ui/react";
import { BsCart } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useEffect, useState } from "react";

export default function CartButton(props) {
  const nav = useNavigate();
  const [count, setCount] = useState();

  async function fetch() {
    const data = await api().post("/cart/id", {
      UserId: props.userSelector.id,
      BranchId: props.orderSelector.BranchId,
    });
    return setCount(data.data.Cart.length);
  }

  useEffect(() => {
    fetch();
  });

  // console.log(props.orderSelector.quantity);

  return (
    <Box>
      <Menu>
        <MenuButton onClick={() => nav("/cart")}>
          <Flex alignItems={"center"} gap={"0.1rem"} cursor={"pointer"}>
            <Box position={"relative"}>
              <Icon as={BsCart} w={10} h={10} color="blue.700"></Icon>
              {count > 0 && (
                <Text
                  position="absolute"
                  bottom="-0.4rem"
                  left="-0.4rem"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  fontWeight="bold"
                  fontSize="sm"
                  p={1}
                >
                  {count}
                </Text>
              )}
            </Box>
          </Flex>
        </MenuButton>
      </Menu>
    </Box>
  );
}
