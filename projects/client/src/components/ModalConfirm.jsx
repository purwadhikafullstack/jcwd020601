import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Button,
  Select,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { api } from "../api/api";

export default function ModalConfirm(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [status, setStatus] = useState();

  // Update Status
  async function update() {
    try {
      await api.patch("/order/v2/status", {
        OrderId: props.id,
        status: "delivery confirm",
      });
      onClose();
      return props.fetch();
    } catch (error) {
      alert(error.response.data);
    }
  }

  return (
    <>
      <Button
        colorScheme={"green"}
        variant={"outline"}
        borderRadius={"1.5rem"}
        width={"100%"}
        onClick={onOpen}
      >
        Complete My Order
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Complete Order
            </AlertDialogHeader>

            <AlertDialogBody fontWeight={"semibold"}>
              Are you sure on completing this order?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="green" ml={3} onClick={update}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
