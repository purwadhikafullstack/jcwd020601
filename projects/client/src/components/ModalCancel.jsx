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

export default function ModalCancel(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [status, setStatus] = useState();

  // Update Status
  async function update() {
    try {
      await api().patch("/order/v2/userstatus", {
        OrderId: props.id,
        status: "canceled",
      });
      onClose();
      return props.fetch();
    } catch (error) {
      alert(error.response.data);
      console.log(error);
    }
  }

  return (
    <>
      <Button
        colorScheme={"red"}
        variant={"ghost"}
        borderRadius={"1.5rem"}
        width={"100%"}
        onClick={onOpen}
      >
        Cancel My Order
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Order
            </AlertDialogHeader>

            <AlertDialogBody fontWeight={"semibold"}>
              Are you sure to cancel this order?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="red" ml={3} onClick={update}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
