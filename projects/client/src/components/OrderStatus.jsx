import { Box, Flex } from "@chakra-ui/react";

export default function OrderStatus(props) {
  const { order, status } = props;
  return (
    <Flex alignItems={"center"}>
      <Box padding={"1rem 2rem"} fontSize={"2xl"} fontWeight={"semibold"}>
        {order ? `Invoice Code: ${order[0].Order.invoiceCode}` : null}
      </Box>
      <Box
        padding={"0.2rem"}
        border={"3px solid"}
        boxShadow={
          "1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px"
        }
        ringColor={"red"}
        fontWeight={"semibold"}
        fontSize={"1.3rem"}
        color={
          status === "process" || status === "sending"
            ? "green.500"
            : status === "delivery confirm"
            ? "blue.500"
            : status === "waiting for payment confirmation"
            ? "yellow.500"
            : status === "canceled"
            ? "red.500"
            : "gray.900"
        }
      >
        {status
          ?.toLowerCase()
          .split(" ")
          .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(" ")}
      </Box>
    </Flex>
  );
}
