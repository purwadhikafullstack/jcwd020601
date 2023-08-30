import { Box, Flex, Icon, Menu, MenuButton, Text } from "@chakra-ui/react";
import { BsCart } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CartButton(props) {
  const nav = useNavigate();
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const orderSelector = useSelector((state) => state.login.order);
  const qtySelector = useSelector((state) => state.login.qty);
  return (
    <Box>
      <Menu>
        <MenuButton onClick={() => nav("/cart")}>
          <Flex alignItems={"center"} gap={"0.1rem"} cursor={"pointer"}>
            <Box position={"relative"}>
              <Icon as={BsCart} w={10} h={10} color="blue.700"></Icon>
              {qtySelector.quantity > 0 && (
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
                  {qtySelector.quantity}
                </Text>
              )}
            </Box>
          </Flex>
        </MenuButton>
      </Menu>
    </Box>
  );
}
