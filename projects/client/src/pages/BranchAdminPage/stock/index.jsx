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
  Text,
  Td,
  Flex,
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
import Greetings from "../Greetings";

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
    let response = await api().get(
      `/stock/all?search_query=${keyword}&page=${page}&limit=${limit}&place=${userSelector.branchId}`
    );
    setValue(response.data.result);
    setPage(response.data.page);
    setRows(response.data.totalRows);
    setPages(response.data.totalPage);
  }

  useEffect(() => {
    fetchStock();
  }, [keyword, page]);

  const changePage = ({ selected }) => {
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

  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };
  return (
    <>
      <Box
        marginLeft={{ base: 0, lg: 60 }}
        h={"80vh"}
        overflow={{ base: "scroll", lg: "auto" }}
      >
        <Flex
          flexDir={"column"}
          ml={{ base: 0, lg: "10px" }}
          px={{ base: 0, lg: "10px" }}
          py={{ base: 0, lg: "10px" }}
        >
          <Greetings />
          <TableContainer padding={{ base: 2, lg: 10 }}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              px={5}
            >
              <Box display={"flex"} py={3} pr={3} gap={3}>
                <Input
                  placeholder="Search Stock Book By Name"
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
              {/* getData={fetchStock} */}
              <Box>
                <Add getData={fetchStock} />
              </Box>
            </Box>
            <Table variant="simple">
              <TableCaption
                my={5}
                w={{ base: "27em", lg: "100%" }}
                textAlign="center"
              >
                Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
              </TableCaption>
              <Thead>
                <Tr>
                  <Th fontSize={18}>No</Th>
                  <Th fontSize={18}>Nama Buku</Th>
                  <Th fontSize={18}>Branch </Th>
                  <Th fontSize={18}>Stock</Th>
                  <Th fontSize={18}>Booked-Stock</Th>
                  <Th fontSize={18}>Diskon</Th>
                </Tr>
              </Thead>
              <Tbody>
                {value.map((val, idx) => (
                  <Tr key={val.id}>
                    <Td>{idx + 1 + page * limit}</Td>
                    <Td>{val.Book?.title}</Td>
                    <Td>{val.Branch?.name}</Td>
                    <Td>{val.stock}</Td>
                    <Td>{val.bucket}</Td>
                    <Td>
                      {val.Discount?.isPercent ? (
                        <>{val.Discount?.discount} %</>
                      ) : (
                        <>
                          {val.Discount?.discount ? (
                            <>{rupiah(val.Discount?.discount)}</>
                          ) : (
                            <>
                              <Text>Belum Ada Diskon</Text>
                            </>
                          )}
                        </>
                      )}
                    </Td>
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
        </Flex>
      </Box>
    </>
  );
}
