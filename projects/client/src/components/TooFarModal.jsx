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
import TooFar from "./TooFar";
import { MdClose } from "react-icons/md";

export default function TooFarModal(props) {
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        scrollBehavior="inside"
        isOpen={props.tooFarModal.isOpen}
        onClose={props.tooFarModal.onClose}
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
              <Button w={"30px"} onClick={() => props.tooFarModal.onClose()}>
                <Icon fontSize={"30px"} as={MdClose}></Icon>
              </Button>
            </Flex>
          </ModalHeader>
          <ModalBody maxH="500px" maxW="500px">
            <TooFar />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
