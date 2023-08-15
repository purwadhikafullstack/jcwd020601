import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Flex,
  Icon,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FcImageFile, FcViewDetails } from "react-icons/fc";

export default function ModalDetails(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState();

  return (
    <>
      <Flex
        flexDir={"column"}
        fontSize={"small"}
        cursor={"pointer"}
        onClick={onOpen}
      >
        <Icon fontSize={"4xl"} as={FcViewDetails}></Icon>
        details
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>body</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
