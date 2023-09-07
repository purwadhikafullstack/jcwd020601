import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  Select,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import ModalPayment from "../../../components/admin/transaction/ModalPayment";
import ModalDetails from "../../../components/admin/transaction/ModalDetails";
import ModalConfirm from "../../../components/admin/transaction/ModalConfirm";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { BiSearchAlt2, BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import Greetings from "../Greetings";
export default function BranchOrder() {
  const [trans, setTrans] = useState();
  const userSelector = useSelector((state) => state.login.auth);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(0);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState();
  const [sort, setSort] = useState("");
  function inputHandler(e) {
    setSearch(e.target.value);
  }
  async function fetch() {
    const result = await api().post(`/order/branch?page=${page}&limit=${6}`, {
      BranchId: userSelector.branchId,
      status: status,
      search: search,
      sort,
    });
    setPage(result.data.page);
    setRows(result.data.totalRows);
    setPages(result.data.totalPage);
    setTrans(result.data.Order);
  }
  useEffect(() => {
    fetch();
  }, [page, status, sort]);

  const changePage = ({ selected }) => {
    setPage(selected);
  };
  return (
    <>
      <Box
        marginLeft={{ base: 0, lg: 60 }}
        h={"100%"}
        overflow={{ base: "scroll", lg: "auto" }}
      >
        <Flex flexDir={"column"} ml={"10px"} px={"10px"} py={"10px"}>
          <Greetings />
          <TableContainer padding={{ base: 2, lg: 10 }}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <Flex alignItems={"center"} gap={"4px"}>
                      <Text>Date</Text>
                      <Icon
                        cursor={"pointer"}
                        _hover={{ color: "#90caf9" }}
                        as={BiSolidUpArrow}
                        onClick={() => setSort("dup")}
                      ></Icon>
                      <Icon
                        cursor={"pointer"}
                        _hover={{ color: "#90caf9" }}
                        as={BiSolidDownArrow}
                        onClick={() => setSort("ddown")}
                      ></Icon>
                    </Flex>
                  </Th>
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
                  <Th>
                    <Flex alignItems={"center"} gap={"4px"}>
                      <Text>Transaction Price</Text>
                      <Icon
                        cursor={"pointer"}
                        _hover={{ color: "#90caf9" }}
                        as={BiSolidUpArrow}
                        onClick={() => setSort("tup")}
                      ></Icon>
                      <Icon
                        cursor={"pointer"}
                        _hover={{ color: "#90caf9" }}
                        as={BiSolidDownArrow}
                        onClick={() => setSort("tdown")}
                      ></Icon>
                    </Flex>
                  </Th>
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
                  const date = new Date(val.createdAt);
                  return (
                    <Tr>
                      <Td>{date.toLocaleDateString()}</Td>
                      <Td>{val.invoiceCode}</Td>
                      <Td>Rp {Number(val.total).toLocaleString("id-ID")},-</Td>
                      <Td>
                        <ModalConfirm val={val} fetch={fetch}></ModalConfirm>
                      </Td>
                      <Td>
                        <Flex gap={"0.6rem"}>
                          <ModalPayment val={val} fetch={fetch} />
                          <ModalDetails val={val} date={date} />
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
