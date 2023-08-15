import {
  Box,
  TableContainer,
  Input,
  Button,
  TableCaption,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import { BiSearchAlt } from "react-icons/bi";
import { GrFormAdd, GrPowerReset } from "react-icons/gr";
import { useEffect, useState } from "react";
import Action from "./Action";
import Add from "./Add";
import { api } from "../../../api/api";
import "../../../App.css";
import { useSelector } from "react-redux";

export default function Stock() {
  const userSelector = useSelector((state) => state.login.auth);
  const [value, setValue] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState(0);
  const [pages, setPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  async function fetchStock() {
    let response = await api.get(
      `/stock/all?search_query=${keyword}&page=${page}&limit=${limit}&place=${userSelector.branchId}`
    );
    setValue(response.data.result);
    setPage(response.data.page);
    setRows(response.data.totalRows);
    setPages(response.data.totalPage);
    // console.log(response.data.result);
  }

  useEffect(() => {
    fetchStock();
  }, [keyword, page]);

  const changePage = ({ selected }) => {
    // console.log(selected);
    setPage(selected);
  };

  const searchData = () => {
    setPage(0);
    setKeyword(query);
  };
  const inputSearch = (e) => {
    setQuery(e.target.value);
  };
  const resetKeyWord = () => {
    setKeyword("");
    fetchStock();
    setQuery("");
  };

  // console.log(value);
  // console.log(page);
  // console.log(userSelector.branchId);
  return (
    <>
      <Box
        marginLeft={60}
        marginTop={"6em"}
        h={"80vh"}
        // bgColor={"red"}
        overflow={"auto"}
      >
        <TableContainer padding={10}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            px={5}
          >
            <Box display={"flex"} py={3} gap={3}>
              <Input
                placeholder="Search Stock Book By Name"
                variant={"outline"}
                w={"30em"}
                size="lg"
                onChange={inputSearch}
                value={query}
              />
              <Button
                leftIcon={<BiSearchAlt />}
                onClick={searchData}
                variant="outline"
                size={"lg"}
              >
                Search
              </Button>
              <Button
                leftIcon={<GrPowerReset />}
                onClick={resetKeyWord}
                variant="outline"
                size={"lg"}
              >
                Reset
              </Button>
            </Box>
            {/* getData={fetchStock} */}
            <Add getData={fetchStock} />
          </Box>
          <Table variant="simple">
            <TableCaption my={5}>
              Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
            </TableCaption>
            <Thead>
              <Tr>
                <Th fontSize={18}>No</Th>
                <Th fontSize={18}>Nama Buku</Th>
                <Th fontSize={18}>Branch </Th>
                <Th fontSize={18}>Stock</Th>
              </Tr>
            </Thead>
            <Tbody>
              {value.map((val, idx) => (
                <Tr key={val.id}>
                  <Td>{idx + 1}</Td>
                  <Td>{val.Book?.title}</Td>
                  <Td>{val.Branch?.name}</Td>
                  <Td>{val.stock}</Td>
                  <Td>
                    <Action
                      id={val.id}
                      name={val.Book?.title}
                      getData={fetchStock}
                    />
                  </Td>
                </Tr>
              ))}
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
          />{" "}
        </TableContainer>
      </Box>
    </>
  );
}
