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
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FcImageFile, FcViewDetails } from "react-icons/fc";
import { api } from "../../../api/api";

export default function ModalDetails(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState();

  async function fetch() {
    const result = await api().post("/orderdetail/admin", {
      OrderId: props.val.id,
    });
    return setData(result.data);
  }

  // console.log(data);
  // console.log(props.val.id);

  useEffect(() => {
    if (isOpen) {
      fetch();
    }
  }, [isOpen]);

  return (
    <>
      <Flex
        flexDir={"column"}
        fontSize={"small"}
        cursor={"pointer"}
        onClick={onOpen}
      >
        <Icon fontSize={"4xl"} as={FcViewDetails}></Icon>
        details
      </Flex>

      <Modal size={"full"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table size="xl" variant="simple">
                <Thead>
                  <Tr>
                    <Th>No.</Th>
                    <Th>Buku</Th>
                    <Th>Courier</Th>
                    {/* <Th>Shipping Cost</Th> */}
                    <Th isNumeric>Price</Th>
                    <Th isNumeric>Quantity</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.map((val, idx) => {
                    return (
                      <Tr>
                        <Td>{idx + 1}</Td>
                        <Td>{val.Stock.Book.title}</Td>
                        <Td>{val.Order.courier}</Td>
                        {/* <Td>{val.Order.shipping}</Td> */}
                        <Td isNumeric>{val.Stock.Book.price}</Td>
                        <Td isNumeric>{val.quantity}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
                <Tfoot>
                  <Tr>
                    {/* <Th></Th> */}
                    <Td></Td>
                    <Td isNumeric></Td>
                    <Td isNumeric>Shipping Cost:</Td>
                    <Td isNumeric>{data ? data[0].Order.shipping : null}</Td>
                    <Td isNumeric> </Td>
                  </Tr>
                  <Tr>
                    {/* <Th></Th> */}
                    <Td></Td>
                    <Td isNumeric></Td>
                    <Td isNumeric fontWeight={"semibold"}>
                      Total Price:
                    </Td>
                    <Td isNumeric fontWeight={"semibold"}>
                      {props.val.total}
                    </Td>
                    <Td isNumeric> </Td>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
