import {
  Button,
  Center,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FiXCircle } from "react-icons/fi";
import { MdClose } from "react-icons/md";

export default function NoAddressModal(props) {
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        scrollBehavior="inside"
        isOpen={props.noAddressModal.isOpen}
        onClose={props.noAddressModal.onClose}
        isCentered
      >
        <ModalOverlay bg="blackAlpha.100" />
        <ModalContent maxH="500px" h={"200px"} w={"300px"} maxW="500px">
          <ModalHeader
            bgColor={"#385898"}
            color={"white"}
            display={"flex"}
            justifyContent={"space-around"}
          >
            <Center fontWeight={700}>Oops...</Center>
            <Flex w={"70%"} flexDir={"row-reverse"}>
              <Button w={"30px"} onClick={() => props.noAddressModal.onClose()}>
                <Icon fontSize={"30px"} as={MdClose}></Icon>
              </Button>
            </Flex>
          </ModalHeader>
          <ModalBody maxH="500px" maxW="500px">
            <Center
              textAlign={"center"}
              h={"100px"}
              flexDir={"column"}
              gap={"2px"}
            >
              <Flex fontWeight={"700"} color={"#385898"}>
                You haven't create an address yet
              </Flex>

              <Flex color={"#8b97a9"}>Please create and select one first</Flex>
              <Icon
                mt={"5px"}
                fontSize={"30px"}
                color={"#385898"}
                as={FiXCircle}
              ></Icon>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
