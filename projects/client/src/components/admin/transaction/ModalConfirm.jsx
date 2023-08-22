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
import { api } from "../../../api/api";

export default function ModalConfirm(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [status, setStatus] = useState();

  // Update Status
  async function update() {
    try {
      // console.log(e.target.value);
      // console.log(val.id);
      await api().patch("/order/v2/status", {
        OrderId: props.val.id,
        status: status,
      });
      onClose();
      return props.fetch();
    } catch (error) {
      alert(error.response.data);
    }
  }

  return (
    <>
      {/* <Button colorScheme="red" onClick={onOpen}>
        Update Status
      </Button> */}
      <Select
        value={props.val.status}
        onChange={(e) => {
          setStatus(e.target.value);
          onOpen();
        }}
        // onChange={(e) => update(e, val)}
      >
        <option value="waiting for payment">Waiting for Payment</option>
        <option value="waiting for payment confirmation">
          Waiting for Payment Confirmation
        </option>
        <option value="process">Process</option>
        <option value="sending">Sending</option>
        <option value="delivery confirm">Delivery Confirm</option>
        <option value="canceled">Canceled</option>
      </Select>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Update Status
            </AlertDialogHeader>

            <AlertDialogBody fontWeight={"semibold"}>
              Are you sure? To change the order status to "{status}"
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="yellow" onClick={update} ml={3}>
                Update
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
