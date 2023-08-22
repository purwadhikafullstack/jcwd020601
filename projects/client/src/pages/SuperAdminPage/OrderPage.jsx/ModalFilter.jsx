import {
  Button,
  Center,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdClose } from "react-icons/md";

export default function ModalFilter(props) {
  function inputHandler(input) {
    const { value, id } = input.target;
    const tempobject = { ...props.filter };
    tempobject[id] = value;
    props.setFilter(tempobject);
    console.log(tempobject);
  }
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        scrollBehavior="inside"
        isOpen={props.modalFilter.isOpen}
        onClose={props.modalFilter.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent maxH={"500px"} maxW="500px">
          <ModalHeader
            w={"100%"}
            px={"10px"}
            display={"flex"}
            flexDir={"row"}
            justifyContent={"center"}
            bgColor={"#385898"}
          >
            <Center w={"200px"} fontWeight={700} color={"white"}>
              Transaction Filter
            </Center>
            <Flex w={"70%"} flexDir={"row-reverse"}>
              <Button w={"30px"} onClick={props.modalFilter.onClose}>
                <Icon fontSize={"30px"} as={MdClose}></Icon>
              </Button>
            </Flex>
          </ModalHeader>
          <ModalBody maxW="500px">
            <Flex mb={"10px"}>
              <Flex flexDir={"column"} gap={"10px"} w={"100%"}>
                <Flex flexDir={"column"} gap={"5px"} w={"100%"}>
                  <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                    BranchId
                  </Flex>
                  <Input
                    onChange={inputHandler}
                    id="BranchId"
                    w={"100%"}
                    variant={"filled"}
                  ></Input>
                </Flex>
                <Flex flexDir={"column"} gap={"5px"}>
                  <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                    OrderId
                  </Flex>
                  <Input
                    onChange={inputHandler}
                    id="OrderId"
                    variant={"filled"}
                  ></Input>
                </Flex>{" "}
                <Flex flexDir={"column"} gap={"5px"}>
                  <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                    Transaction Status
                  </Flex>
                  <Input
                    onChange={inputHandler}
                    id="status"
                    variant={"filled"}
                  ></Input>
                </Flex>{" "}
                <Flex flexDir={"column"} gap={"5px"}>
                  <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                    Before
                  </Flex>
                  <Input
                    onChange={inputHandler}
                    id="before"
                    type="datetime-local"
                    variant={"filled"}
                  ></Input>
                </Flex>{" "}
                <Flex flexDir={"column"} gap={"5px"}>
                  <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                    After
                  </Flex>
                  <Input
                    onChange={inputHandler}
                    id="after"
                    type="datetime-local"
                    variant={"filled"}
                  ></Input>
                </Flex>
                <Flex mt={"20px"} flexDir={"row-reverse"} gap={"20px"}>
                  <Button onClick={props.modalFilter.onClose}>Cancel</Button>
                  <Button
                    onClick={() => {
                      props.modalFilter.onClose();
                      props.submit();
                    }}
                    bgColor={"#385898"}
                    color={"white"}
                  >
                    Search
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
