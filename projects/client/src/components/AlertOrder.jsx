import {
  Button,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  AlertDialog,
} from "@chakra-ui/react";
import { useRef } from "react";

export default function AlertOrder(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  return (
    <>
      <Button
        colorScheme={"blue"}
        borderRadius={"1.5rem"}
        width={"100%"}
        onClick={onOpen}
      >
        Create Order
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Create Order
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Check
              </Button>
              <Button colorScheme="blue" onClick={props.create} ml={3}>
                Create
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
