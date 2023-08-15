import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Icon,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import NavbarFooter from "../../components/admin/NavbarFooter";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Admin";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { FcImageFile, FcViewDetails } from "react-icons/fc";
import ModalPayment from "../../components/admin/transaction/ModalPayment";
import ModalDetails from "../../components/admin/transaction/ModalDetails";
import ModalConfirm from "../../components/admin/transaction/ModalConfirm";

export default function BranchOrder() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [trans, setTrans] = useState();

  // GET
  async function fetch() {
    const result = await api.post("/order/branch", {
      BranchId: 2,
    });
    return setTrans(result.data);
  }

  // Update Status
  async function status(e, val) {
    try {
      if (e.target.value === "sending" || e.target.value === "canceled") {
        alert("this will change the available stock");
      }
      // console.log(e.target.value);
      // console.log(val.id);
      await api.patch("/order/v2/status", {
        OrderId: val.id,
        status: e.target.value,
      });
      // return onOpen();
      return fetch();
    } catch (error) {
      alert(error.response.data);
    }
  }
  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      <Flex>
        <Sidebar />
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
          <Navbar />

          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Order-ID</Th>
                  <Th>Transaction Price</Th>
                  <Th>Transaction Status</Th>
                  <Th>Check</Th>
                </Tr>
              </Thead>
              <Tbody>
                {trans?.map((val) => {
                  return (
                    <Tr>
                      <Td>{val.id}</Td>
                      <Td>Rp {Number(val.total).toLocaleString("id-ID")},-</Td>
                      <Td>
                        <ModalConfirm onOpen={onOpen}></ModalConfirm>
                        <Select
                          value={val.status}
                          onChange={(e) => status(e, val)}
                        >
                          <option value="waiting for payment">
                            Waiting for Payment
                          </option>
                          <option value="waiting for payment confirmation">
                            Waiting for Payment Confirmation
                          </option>
                          <option value="process">Process</option>
                          <option value="sending">Sending</option>
                          <option value="delivery confirm">
                            Delivery Confirm
                          </option>
                          <option value="canceled">Canceled</option>
                        </Select>
                      </Td>
                      <Td>
                        <Flex gap={"0.6rem"}>
                          <ModalPayment val={val} />
                          <ModalDetails val={val} />
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex>
            <Flex></Flex>
          </Flex>
          <NavbarFooter />
        </Box>
      </Flex>
    </>
  );
}
