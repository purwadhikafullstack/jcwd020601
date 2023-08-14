import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  Image,
  Input,
  Text,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { api } from "../../api/api";
import ReactPaginate from "react-paginate";
import "../../App.css";
import { BiSearchAlt } from "react-icons/bi";
import { GrFormAdd, GrPowerReset } from "react-icons/gr";
import Add from "./product/Add";
import Action from "./product/Action";

export default function Product() {
  let t = localStorage.getItem("auth");
  const [value, setValue] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState(0);
  const [pages, setPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [token, setToken] = useState(JSON.parse(t));

  async function fetchProduct() {
    let response = await api.get(
      `/book?search_query=${keyword}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    // setToken(JSON.parse(t));
    setValue(response.data.result);
    setPage(response.data.page);
    setRows(response.data.totalRows);
    setPages(response.data.totalPage);
  }
  useEffect(() => {
    fetchProduct();
  }, [page, keyword]);

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
    fetchProduct();
    setQuery("");
  };
  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };
  console.log(value);

  return (
    <>
      <Box marginLeft={0}>
        <TableContainer padding={10}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            px={5}
          >
            <Box display={"flex"} py={3} gap={3}>
              <Input
                placeholder="Search data"
                variant={"outline"}
                w={"30em"}
                size="lg"
                value={query}
                onChange={inputSearch}
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
            <Add getData={fetchProduct} token={token} />
          </Box>
          <Table variant="simple">
            <TableCaption my={5}>
              Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
            </TableCaption>
            <Thead>
              <Tr>
                <Th fontSize={18}>No</Th>
                <Th fontSize={18}>Judul</Th>
                {/* <Th fontSize={18}>Bahasa</Th> */}
                <Th fontSize={18}>Penulis</Th>
                <Th fontSize={18}>Diskon</Th>
                <Th fontSize={18}>Lembar</Th>
                <Th fontSize={18}>Harga</Th>
                <Th fontSize={18}>Gambar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {value.map((val, idx) => (
                <Tr key={val.id}>
                  <Td>{idx + 1 + page * limit}</Td>
                  <Td>{val.title}</Td>
                  {/* <Td>{val.language}</Td> */}
                  <Td>{val.author}</Td>
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
                  <Td>{val.pages}</Td>
                  <Td>{rupiah(val.price)}</Td>

                  <Td>
                    <Image src={val.book_url} w={50} h={50} />
                  </Td>
                  <Td>
                    <Action
                      id={val.id}
                      name={val.title}
                      getData={fetchProduct}
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
