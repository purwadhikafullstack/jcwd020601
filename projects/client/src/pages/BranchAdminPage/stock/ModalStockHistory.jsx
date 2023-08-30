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
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Center,
  calc,
} from "@chakra-ui/react";
import { api } from "../../../api/api";
import { useEffect } from "react";
import { useState } from "react";

export default function ModalStockHistory({ isOpen, onClose, id, name }) {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [stock, setStock] = useState();
  async function fetch() {
    const data = await api().post("/stockhistory/id", {
      StockId: id,
    });
    setStock(data.data);
  }
  useEffect(() => {
    if (isOpen) {
      fetch();
    }
  }, [isOpen]);
  return (
    <>
      <Text>Stock History</Text>
      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center> Stock Histories of "{name}"</Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table variant="simple">
                {/* <TableCaption>
                  Imperial to metric conversion factors
                </TableCaption> */}
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Subject</Th>
                    <Th>Action</Th>
                    <Th isNumeric>Quantity</Th>
                    <Th isNumeric>Total Before</Th>
                    <Th isNumeric>Total After</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stock?.map((val) => {
                    return (
                      <Tr>
                        <Td>{new Date(val.createdAt).toLocaleString()}</Td>
                        <Td>{val.subject}</Td>
                        <Td
                          color={
                            val.type === "plus" ? "blue.500" : "orange.500"
                          }
                        >
                          {val.type}
                        </Td>
                        <Td isNumeric>{val.quantity}</Td>
                        <Td isNumeric>{val.totalBefore}</Td>
                        <Td fontWeight={"semibold"} isNumeric>
                          {val.totalAfter}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>&copy;</Th>
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
