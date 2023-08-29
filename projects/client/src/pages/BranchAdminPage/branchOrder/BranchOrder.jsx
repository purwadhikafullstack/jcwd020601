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
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import ModalPayment from "../../../components/admin/transaction/ModalPayment";
import ModalDetails from "../../../components/admin/transaction/ModalDetails";
import ModalConfirm from "../../../components/admin/transaction/ModalConfirm";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { BiSearchAlt2 } from "react-icons/bi";
import Greetings from "../Greetings";
export default function BranchOrder() {
  const [trans, setTrans] = useState();
  const userSelector = useSelector((state) => state.login.auth);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(0);
  // const [limit, setLimit] = useState(6);
  const [rows, setRows] = useState(0);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState();

  // console.log(status);
  function inputHandler(e) {
    setSearch(e.target.value);
  }
  console.log(search);

  // GET
  async function fetch() {
    console.log(status);
    console.log(search);
    const result = await api().post(`/order/branch?page=${page}&limit=${6}`, {
      BranchId: userSelector.branchId,
      status: status,
      search: search,
    });
    setPage(result.data.page);
    setRows(result.data.totalRows);
    setPages(result.data.totalPage);
    console.log(result);
    setTrans(result.data.Order);
  }
  console.log(pages);
  console.log(page);
  useEffect(() => {
    fetch();
  }, [page, status]);

  //
  const changePage = ({ selected }) => {
    // console.log(selected);
    setPage(selected);
  };
  //
  return (
    <>
      <Box marginLeft={60} h={"100%"} overflow={"auto"}>
        <Flex flexDir={"column"} ml={"10px"} px={"10px"} py={"10px"}>
          <Greetings />
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <InputGroup>
                      <Input
                        value={search}
                        onChange={inputHandler}
                        placeholder="Invoice Code"
                      />
                      <InputRightElement>
                        <Icon
                          cursor={"pointer"}
                          as={BiSearchAlt2}
                          onClick={() => {
                            fetch();
                          }}
                        ></Icon>
                      </InputRightElement>
                    </InputGroup>
                  </Th>
                  <Th>Transaction Price</Th>
                  <Th>
                    <Flex alignItems={"center"} gap={"0.3rem"}>
                      <Box>Filter by Status:</Box>
                      <Select
                        maxW={"20rem"}
                        value={status}
                        onChange={(e) => {
                          setSearch("");
                          setStatus(e.target.value);
                        }}
                      >
                        <option value="all">All</option>
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
                    </Flex>
                  </Th>
                  <Th>Check</Th>
                </Tr>
              </Thead>
              <Tbody>
                {trans?.map((val) => {
                  return (
                    <Tr>
                      <Td>{val.invoiceCode}</Td>
                      <Td>Rp {Number(val.total).toLocaleString("id-ID")},-</Td>
                      <Td>
                        <ModalConfirm val={val} fetch={fetch}></ModalConfirm>
                      </Td>
                      <Td>
                        <Flex gap={"0.6rem"}>
                          <ModalPayment val={val} fetch={fetch} />
                          <ModalDetails val={val} />
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
            <Box marginTop={"1rem"}>
              <ReactPaginate
                previousLabel={"< Prev"}
                nextLabel={"Next >"}
                pageCount={pages}
                onPageChange={changePage}
                breakLabel="..."
                containerClassName="pagination"
                pageLinkClassName="page-num"
                renderOnZeroPageCount={null}
                previousLinkClassName="page-num"
                nextLinkClassName="page-num"
                activeLinkClassName="active"
                pageRangeDisplayed={3}
              />
            </Box>
          </TableContainer>
        </Flex>
        <Flex>
          <Flex></Flex>
        </Flex>
      </Box>
    </>
  );
}
