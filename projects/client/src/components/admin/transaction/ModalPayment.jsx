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
import { FcImageFile, FcViewDetails } from "react-icons/fc";

export default function ModalPayment(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Flex
        flexDir={"column"}
        fontSize={"small"}
        cursor={"pointer"}
        onClick={onOpen}
      >
        <Icon fontSize={"4xl"} as={FcImageFile}></Icon>
        payment
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment Proof</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={props.val.payment_url}></Image>
          </ModalBody>

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
