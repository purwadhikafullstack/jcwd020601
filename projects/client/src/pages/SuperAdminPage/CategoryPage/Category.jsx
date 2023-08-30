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
  Flex,
  Text,
} from "@chakra-ui/react";

import ReactPaginate from "react-paginate";
import { BiSearchAlt } from "react-icons/bi";
import { GrPowerReset } from "react-icons/gr";
import { useEffect, useState } from "react";
// import Add from "./CategoryPage/Add";
import Add from "./Add";
import Action from "./Action";
import "../../../App.css";
import { api } from "../../../api/api";
import Greetings from "../Greetings";
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
    let response = await api().get(
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
  return (
    <>
      <Box marginLeft={{ base: 0, lg: 60 }}>
        <Flex flexDir={"column"} ml={"10px"} px={"10px"} py={"10px"}>
          <Greetings />
          <TableContainer padding={5}>
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
                  w={{ base: "15em", lg: "30em" }}
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
                  <Text display={{ base: "none", lg: "block" }}>Search</Text>
                </Button>
                <Button
                  leftIcon={<GrPowerReset />}
                  onClick={resetKeyWord}
                  variant="outline"
                  size={"lg"}
                >
                  <Text display={{ base: "none", lg: "block" }}>Reset</Text>
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
        </Flex>
      </Box>
    </>
  );
}
