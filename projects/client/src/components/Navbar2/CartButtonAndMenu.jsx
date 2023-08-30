import {
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import CartButton from "../CartButton";
import { useSelector } from "react-redux";
const IMGURL = process.env.REACT_APP_API_IMAGE_URL;
export default function CartButtonAndMenu({ logout, login, nav }) {
  const userSelector = useSelector((state) => state.login.auth);
  return (
    <>
      <Box
        display={"flex"}
        w={{ sm: "10em", md: "15em", lg: "20em" }}
        alignItems={"center"}
        justifyContent={"space-evenly"}
        h={"60px"}
      >
        <CartButton></CartButton>
        <Box>
          <Menu>
            <MenuButton>
              <Flex alignItems={"center"} gap={"0.1rem"} cursor={"pointer"}>
                <Image
                  w={"50px"}
                  h="50px"
                  borderRadius="full"
                  objectFit={"fill"}
                  border={"2px #0060ae solid"}
                  src={
                    userSelector.avatar_url
                      ? IMGURL + userSelector.avatar_url
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT19eLyqRHQDO-VnXj1HhzL_9q8yHF-3ewIhA&usqp=CAU"
                  }
                ></Image>
              </Flex>
            </MenuButton>
            <MenuList my={"12px"} position={"fixed"} left={"-6em"} p={0}>
              <Flex flexDir={"column"}>
                <Text
                  onClick={() => nav("/profile")}
                  cursor={"pointer"}
                  _hover={{ bgColor: "#BEE3F8", color: "#2C5282" }}
                  p={3}
                >
                  My Account
                </Text>
                <Text
                  onClick={() => nav("/orders")}
                  cursor={"pointer"}
                  _hover={{ bgColor: "#BEE3F8", color: "#2C5282" }}
                  p={3}
                >
                  My Orders
                </Text>
                <Text
                  onClick={userSelector.email ? logout : login}
                  _hover={{ bgColor: "#BEE3F8", color: "#2C5282" }}
                  p={3}
                  cursor={"pointer"}
                >
                  {userSelector.email ? "Logout" : "Login"}
                </Text>
              </Flex>
            </MenuList>
          </Menu>
        </Box>
      </Box>
    </>
  );
}
