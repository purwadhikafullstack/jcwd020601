import { Box, Button, Flex } from "@chakra-ui/react";
import ModalCancel from "./ModalCancel";
import ModalConfirm from "./ModalConfirm";

export default function OrderAction(props) {
  const { inputFileRef, status, order } = props;
  return (
    <Flex
      flexDir={"column"}
      boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
      borderRadius={"0.7rem"}
    >
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        padding={"2rem"}
        gap={"1rem"}
        fontWeight={"semibold"}
      >
        {status === "delivery confirm" || status === "canceled" ? (
          <Box ringColor={"red"} fontWeight={"semibold"} fontSize={"1.2rem"}>
            Order Status: {status}
          </Box>
        ) : status === "process" ? (
          <>
            <Box ringColor={"red"} fontWeight={"semibold"} fontSize={"1.2rem"}>
              Order Status: {status}
            </Box>
            <ModalCancel fetch={fetch} id={order[0].OrderId}></ModalCancel>
            {/*  */}
          </>
        ) : status === "sending" ? (
          <>
            <Box ringColor={"red"} fontWeight={"semibold"} fontSize={"1.2rem"}>
              Order Status: {status}
            </Box>
            <ModalConfirm fetch={fetch} id={order[0].OrderId}></ModalConfirm>
            {/*  */}
          </>
        ) : status === "waiting for payment confirmation" ? (
          <>
            <Box ringColor={"red"} fontWeight={"semibold"} fontSize={"1.2rem"}>
              Order Status: {status}
            </Box>
            <Button
              colorScheme={"blue"}
              borderRadius={"1.5rem"}
              width={"100%"}
              onClick={() => inputFileRef.current.click()}
            >
              Upload Payment Proof
            </Button>
            {/*  */}
            <ModalCancel fetch={fetch} id={order[0].OrderId}></ModalCancel>
            {/*  */}
          </>
        ) : (
          <>
            <Box ringColor={"red"} fontWeight={"semibold"} fontSize={"1.2rem"}>
              Order Status: {status}
            </Box>
            <Button
              colorScheme={"blue"}
              borderRadius={"1.5rem"}
              width={"100%"}
              onClick={() => inputFileRef.current.click()}
            >
              Upload Payment Proof
            </Button>
            {/*  */}
            <ModalCancel fetch={fetch} id={order[0].OrderId}></ModalCancel>
            {/*  */}
          </>
        )}
      </Flex>
    </Flex>
  );
}
