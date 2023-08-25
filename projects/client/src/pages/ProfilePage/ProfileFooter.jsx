import { Flex, Icon } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { HiClipboardList } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { BsBasketFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function ProfileFooter(props) {
  const nav = useNavigate();
  return (
    <>
      <props.Center
        position={"fixed"}
        bottom={0}
        zIndex={1}
        bgColor={"#385898"}
        h={"50px"}
        alignItems={"center"}
        w={"100dvw"}
        justifyContent={"space-evenly"}
      >
        <Icon fontSize={"24px"} color={"white"} as={HiClipboardList}></Icon>
        <Icon
          fontSize={"24px"}
          onClick={() => nav("/")}
          color={"white"}
          as={AiFillHome}
        ></Icon>
        <Icon fontSize={"24px"} color={"white"} as={BsBasketFill}></Icon>
        <Icon fontSize={"24px"} color={"white"} as={FaUserCircle}></Icon>
      </props.Center>
    </>
  );
}
