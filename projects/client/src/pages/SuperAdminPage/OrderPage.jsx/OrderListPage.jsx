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
  useDisclosure,
  Center,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import ModalPayment from "../../../components/admin/transaction/ModalPayment";
import ModalDetails from "../../../components/admin/transaction/ModalDetails";
import ReactPaginate from "react-paginate";
import ModalFilter from "./ModalFilter";
import Greetings from "../Greetings";

export default function BranchOrder() {
  const [trans, setTrans] = useState();
  const [filter, setFilter] = useState();
  const [filtered, setFiltered] = useState(false);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(0);
  const modalFilter = useDisclosure();

  async function submitFilter() {
    const result = await api().post(
      `/order/filter?page=${page}&limit=${5}`,
      filter
    );
    setPage(result.data.page);
    setRows(result.data.totalRows);
    setPages(result.data.totalPage);
    setTrans(result.data.Order);
    setFiltered(true);
  }
  async function fetch() {
    const result = await api().post(`/order/allbranch?page=${page}&limit=${5}`);
    setPage(result.data.page);
    setRows(result.data.totalRows);
    setPages(result.data.totalPage);
    setTrans(result.data.Order);
  }

  useEffect(() => {
    if (filter) {
      submitFilter();
    } else {
      fetch();
    }
  }, [page]);

  //
  const changePage = ({ selected }) => {
    // console.log(selected);
    setPage(selected);
  };
  //
  return (
    <>
      <Box
        bgColor={"#fbfbfb"}
        // display={"flex"}
        // flexDirection={"column"}
        marginLeft={60}
        // bgColor={"red"}
        py={"10px"}
        px={"10px"}
      >
        <Flex ml={"10px"}>
          <Flex flexDir={"column"} gap={"10px"} w={"100%"}>
            <Greetings />
            <Flex
              my={"10px"}
              pr={"15px"}
              w={"100%"}
              borderRadius={"8px"}
              justifyContent={"space-between"}
            >
              <Center
                border={"2px #2c5282 solid"}
                w={"120px"}
                p={"10px"}
                bgColor={filtered ? "#2c5282" : "white"}
                color={filtered ? "white" : "#2c5282"}
                borderRadius={"10px"}
                onClick={() => {
                  fetch();
                  setFilter();
                  setFiltered(false);
                }}
                fontWeight={700}
                cursor={"pointer"}
              >
                {filtered ? "Filtered : On" : "Filtered : Off"}
              </Center>
              <Flex alignItems={"center"} gap={"30px"} mr={"90px"}>
                <Button
                  onClick={() => {
                    modalFilter.onOpen();
                    setFilter();
                  }}
                  bgColor={"#2c5282"}
                  color={"white"}
                >
                  Filter
                </Button>
                <Button bgColor={"#2c5282"} color={"white"}>
                  Sort By
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Order-ID</Th>
                <Th>Branch-Name</Th>
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
                    <Td>{val.Branch.name}</Td>
                    <Td>Rp {Number(val.total).toLocaleString("id-ID")},-</Td>
                    <Td>
                      {val.status.charAt(0).toUpperCase() + val.status.slice(1)}{" "}
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
        </TableContainer>
        <ModalFilter
          filter={filter}
          setFilter={setFilter}
          modalFilter={modalFilter}
          submitFilter={submitFilter}
        />
      </Box>
    </>
  );
}
