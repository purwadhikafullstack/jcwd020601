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
  Select,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { api } from "../../../api/api";
import ReactPaginate from "react-paginate";
import "../../../App.css";
import { BiSearchAlt } from "react-icons/bi";
import { GrFormAdd, GrPowerReset } from "react-icons/gr";
import Add from "./Add";
import Action from "./Action";
import Greetings from "../Greetings";
export default function Product() {
  const IMG = process.env.REACT_APP_API_IMAGE_URL;
  let t = localStorage.getItem("auth");
  const [value, setValue] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState(0);
  const [pages, setPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [token, setToken] = useState(JSON.parse(t));
  const [category, setCategory] = useState([]);
  const [test, setTest] = useState(false);
  const [idCategory, setIdCategory] = useState(null);
  const [list, setList] = useState(null);

  async function fetchProduct() {
    let url = `/book?search_query=${keyword}&page=${page}&limit=${limit}`;
    if (idCategory !== null) {
      url += `&category=${idCategory}`;
    }
    if (list !== null) {
      url += `&list=${list}`;
    }

    let response = await api().get(url, {
      headers: {
        Authorization: token,
      },
    });
    setValue(response.data.result);
    setPage(response.data.page);
    setRows(response.data.totalRows);
    setPages(response.data.totalPage);
  }
  useEffect(() => {
    fetchProduct();
  }, [page, keyword, idCategory, list]);

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
  const fetchCategori = async () => {
    let response = await api().get(`/category`);
    setCategory(response.data.result);
  };
  useEffect(() => {
    fetchProduct();
    fetchCategori();
  }, []);
  const onChangeCategory = (e) => {
    setIdCategory(parseInt(e));
    if (e == "") {
      setIdCategory(null);
    }
  };
  const onChangeList = (e) => {
    setList(e);
    if (e == "") {
      setList(null);
    }
  };
  return (
    <>
      <Box marginLeft={60}>
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
                  placeholder="Search Product"
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
                <Select
                  onChange={(e) => onChangeCategory(e.target.value)}
                  placeholder="Category"
                  value={idCategory}
                  w={"150px"}
                  size={"lg"}
                  // mr={2}
                >
                  {category.map((cate, idx) => (
                    <option key={idx} value={cate.id}>
                      {cate.category}
                    </option>
                  ))}
                </Select>
                <Select
                  onChange={(e) => onChangeList(e.target.value)}
                  placeholder="Order By"
                  value={list}
                  w={"150px"}
                  size={"lg"}
                  // mr={8}
                >
                  <option value={"highest"}>Harga Tertinggi</option>
                  <option value={"lowest"}>Harga Terendah</option>
                  <option value={"alfabet"}>A-Z</option>
                </Select>
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
                  <Th fontSize={18}>Penulis</Th>
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
                    <Td>{val.author}</Td>
                    <Td>{val.pages}</Td>
                    <Td>{rupiah(val.price)}</Td>
                    <Td>
                      <Image src={IMG + val.book_url} w={50} h={50} />
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
        </Flex>
      </Box>
    </>
  );
}
