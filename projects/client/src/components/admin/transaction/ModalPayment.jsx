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
  Box,
} from "@chakra-ui/react";
import { FcImageFile } from "react-icons/fc";
import { MdCancelPresentation } from "react-icons/md";
import { api } from "../../../api/api";
export default function ModalPayment(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  async function update(status) {
    try {
      await api().patch("/order/v2/status", {
        OrderId: props.val.id,
        status: status.toLowerCase(),
      });
      onClose();
      return props.fetch();
    } catch (error) {
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
              <Image
                src={
                  process.env.REACT_APP_API_IMAGE_URL + props.val.payment_url
                }
              ></Image>
            ) : (
              <Center height={"300px"} fontSize={"8xl"}>
                <Icon color={"grey"} as={MdCancelPresentation}></Icon>
              </Center>
            )}
          </ModalBody>

          <ModalFooter>
            <Box w={"100%"} display={props.noEdit ? "none" : "inline-flex"}>
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
                onClick={() => {
                  return update("Waiting for Payment");
                }}
              >
                Reject Payment
              </Button>
              <Button
                colorScheme="green"
                mr={3}
                onClick={() => {
                  return update("process");
                }}
              >
                Accept Payment
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
