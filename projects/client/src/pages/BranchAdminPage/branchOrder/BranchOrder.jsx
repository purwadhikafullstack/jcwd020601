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
import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import ModalPayment from "../../../components/admin/transaction/ModalPayment";
import ModalDetails from "../../../components/admin/transaction/ModalDetails";
import ModalConfirm from "../../../components/admin/transaction/ModalConfirm";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";

export default function BranchOrder() {
  const [trans, setTrans] = useState();
  const userSelector = useSelector((state) => state.login.auth);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(0);
  // const [limit, setLimit] = useState(6);
  const [rows, setRows] = useState(0);

  // GET
  async function fetch() {
    const result = await api().post(`/order/branch?page=${page}&limit=${6}`, {
      BranchId: userSelector.branchId,
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
        // display={"flex"}
        // flexDirection={"column"}
        marginLeft={60}
        marginTop={"6em"}
        h={"80vh"}
        // bgColor={"red"}
        overflow={"auto"}
      >
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
                      <ModalConfirm val={val} fetch={fetch}></ModalConfirm>
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
        <Flex>
          <Flex></Flex>
        </Flex>
      </Box>
    </>
  );
}
