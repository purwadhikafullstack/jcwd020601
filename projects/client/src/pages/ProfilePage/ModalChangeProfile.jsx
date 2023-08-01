import {
  Box,
  Center,
  Flex,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  IconButton,
  Img,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import React from "react";

export default function ModalChangeProfile(props) {
  const userSelector = useSelector((state) => state.login.auth);

  const dispatch = useDispatch();

  return (
    <>
      <Box
        w={"400px"}
        flexDir={"column"}
        h={"100%"}
        gap={"100px"}
        bgColor={"#F2F4F7"}
        p={"20px"}
      >
        <Flex
          fontSize={"30px"}
          fontFamily={"sans-serif"}
          justifyContent={"space-between"}
          color={"#385898"}
          fontWeight={"600"}
        >
          <Flex pt={"10px"}>Save Changes?</Flex>
          <Center>
            <Icon
              color={"grey"}
              cursor={"pointer"}
              onClick={() => {
                props.onClose();
              }}
              as={AiOutlineClose}
            ></Icon>
          </Center>
        </Flex>
        <Flex p={"10px"} justifyContent={"space-evenly"} mt={"20px"}>
          <Button
            w={"150px"}
            bgColor={"#385898"}
            color={"white"}
            onClick={() => {
              props.onClose();
              props.formik.handleSubmit();
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              props.onClose();
            }}
            w={"150px"}
            bgColor={"white"}
          >
            Decline
          </Button>
        </Flex>
      </Box>
    </>
  );
}
