import {
  Button,
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import ModalAddAdmin from "../components/ModalAddAdmin.jsx";

export default function SuperAdminPage() {
  
  const modalAddAdmin = useDisclosure();
  return (
    <>
      <Flex>
        <Button
          onClick={() => {
            modalAddAdmin.onOpen();
          }}
        >
          Add Branch-Admin
        </Button>
        <Modal
          scrollBehavior="inside"
          isOpen={modalAddAdmin.isOpen}
          onClose={modalAddAdmin.onClose}
          isCentered
        >
          <ModalOverlay />
          <ModalContent maxH="500px" h={"500px"} maxW="500px">
            <ModalCloseButton />
            <ModalHeader>
              <Center fontWeight={700}>Add Address</Center>
            </ModalHeader>

            <ModalBody maxH="500px" h={"500px"} maxW="500px">
              <ModalAddAdmin></ModalAddAdmin>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
}
