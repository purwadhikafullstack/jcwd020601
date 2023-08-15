import { Center, Flex, Icon } from "@chakra-ui/react";
import { FiXCircle } from "react-icons/fi";

export default function TooFar(props) {
  return (
    <>
      <Center textAlign={"center"} h={"100px"} flexDir={"column"} gap={"2px"}>
        <Flex fontWeight={"700"} color={"#385898"}>
          Your address is too far
        </Flex>

        <Flex color={"#8b97a9"}>There are no close branch nearby</Flex>
        <Icon
          mt={"5px"}
          fontSize={"30px"}
          color={"#385898"}
          as={FiXCircle}
        ></Icon>
      </Center>
    </>
  );
}
