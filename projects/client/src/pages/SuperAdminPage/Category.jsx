import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  Input,
  Button,
} from "@chakra-ui/react";

import ReactPaginate from "react-paginate";
import { BiSearchAlt } from "react-icons/bi";
import { GrPowerReset } from "react-icons/gr";
import { useEffect, useState } from "react";
import Add from "./CategoryPage/Add";
import Action from "./CategoryPage/Action";
import "../../App.css";
import { api } from "../../api/api";
export default function Category() {
  let t = localStorage.getItem("auth");
  const [value, setValue] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState(0);
  const [pages, setPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [token, setToken] = useState(JSON.parse(t));

  async function fetchCategori() {
    let response = await api.get(
      `/category?search_query=${keyword}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setValue(response.data.result);
    setPage(response.data.page);
    setRows(response.data.totalRows);
    setPages(response.data.totalPage);
  }
  const inputSearch = (e) => {
    setQuery(e.target.value);
  };
  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const searchData = () => {
    setPage(0);
    setKeyword(query);
  };
  useEffect(() => {
    fetchCategori();
  }, [page, keyword]);

  const resetKeyWord = () => {
    setKeyword("");
    fetchCategori();
    setQuery("");
  };
  console.log(value);
  return (
    <>
      <Box marginTop={"6em"} marginLeft={60}>
        <TableContainer padding={10}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            px={5}
          >
            <Box display={"flex"} py={3} gap={3}>
              <Input
                placeholder="Search Category"
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
            <Add getData={fetchCategori} token={token} />
          </Box>
          <Table variant="simple">
            <TableCaption my={5}>
              Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
            </TableCaption>
            <Thead>
              <Tr>
                <Th fontSize={18}>No</Th>
                <Th fontSize={18}>Categori</Th>
                <Th fontSize={18}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {value.map((val, idx) => (
                <Tr key={val.id}>
                  <Td>{idx + 1}</Td>
                  <Td>{val.category}</Td>
                  <Td>
                    <Action
                      id={val.id}
                      name={val.category}
                      getData={fetchCategori}
                      token={token}
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
