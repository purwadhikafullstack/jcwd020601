import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { AiTwotoneDelete } from "react-icons/ai";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function DeleteModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const nav = useNavigate();

  async function hapus() {
    await api().delete("cart/v3/" + props.cartId);
    props.setHapus(false);
  }
  return (
    <>
      <Button variant="ghost" colorScheme={"red"} onClick={onOpen}>
        <Icon as={AiTwotoneDelete}></Icon>
        Delete
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete?</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="ghost"
              colorScheme={"red"}
              onClick={() => {
                hapus();
                onClose();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
