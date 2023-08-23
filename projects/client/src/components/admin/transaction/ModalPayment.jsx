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
  Center,
} from "@chakra-ui/react";
import { FcImageFile, FcViewDetails } from "react-icons/fc";
import { MdCancelPresentation } from "react-icons/md";
import { api } from "../../../api/api";

export default function ModalPayment(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Update Status
  async function update(status) {
    try {
      // console.log(e.target.value);
      // console.log(val.id);
      await api().patch("/order/v2/status", {
        OrderId: props.val.id,
        status: status,
      });
      onClose();
      if (status === "Waiting for Payment") {
        await api().delete("/order/img/" + props.val.id);
      }
      return props.fetch();
    } catch (error) {
      console.log(error);
      alert(error.response.data);
    }
  }
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
            {props.val.payment_url ? (
              <Image src={props.val.payment_url}></Image>
            ) : (
              <Center height={"300px"} fontSize={"8xl"}>
                <Icon color={"grey"} as={MdCancelPresentation}></Icon>
              </Center>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                return update("canceled");
              }}
            >
              Cancel Order
            </Button>

            <Button
              colorScheme="orange"
              mr={3}
              // onClick={update("Waiting for Payment")}
              onClick={() => {
                // setStatus("Waiting for Payment");
                return update("Waiting for Payment");
              }}
            >
              Reject Payment
            </Button>
            <Button
              colorScheme="green"
              mr={3}
              // onClick={update("process")}
              onClick={() => {
                return update("process");
              }}
            >
              Accept Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
