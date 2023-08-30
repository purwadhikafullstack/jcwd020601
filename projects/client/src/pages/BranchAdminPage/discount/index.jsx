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
  Flex,
  Text,
} from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import { BiSearchAlt } from "react-icons/bi";
import { GrFormAdd, GrPowerReset } from "react-icons/gr";
import moment from "moment";
import { api } from "../../../api/api";
import { useEffect, useState } from "react";
import Action from "./Action";
import Add from "./Add";
import { useSelector } from "react-redux";
import Greetings from "../Greetings";

export default function Discount() {
  const userSelector = useSelector((state) => state.login.auth);
  const [value, setValue] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState(0);
  const [pages, setPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  async function fetchDiscount() {
    let response = await api().get(
      `/discount?search_query=${keyword}&page=${page}&limit=${limit}&place=${userSelector.branchId}`
    );
    setValue(response.data.Discount);
    setPage(response.data.page);
    setRows(response.data.totalRows);
    setPages(response.data.totalPage);
  }

  useEffect(() => {
    fetchDiscount();
  }, [pages, keyword]);

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
    fetchDiscount();
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
                  placeholder="Search Discount"
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
              <Add getData={fetchDiscount} />
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
                  <Th fontSize={18}>Nama</Th>
                  <Th fontSize={18}>Diskon</Th>
                  <Th fontSize={18}>Mulai</Th>
                  <Th fontSize={18}>Berakhir</Th>
                </Tr>
              </Thead>
              <Tbody>
                {value.map((val, idx) => (
                  <Tr key={val.id}>
                    <Td>{idx + 1 + page * limit}</Td>
                    <Td>{val.title}</Td>
                    <Td>
                      {val.isPercent ? (
                        <>
                          {val.discount} {" %"}
                        </>
                      ) : (
                        <>{rupiah(val.discount)} </>
                      )}
                    </Td>
                    <Td>{moment(val.start).format("L")}</Td>
                    <Td>{moment(val.end).format("L")}</Td>
                    <Td>
                      <Action
                        id={val.id}
                        name={val.title}
                        getData={fetchDiscount}
                        // token={token}
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
