import {
  Box,
  Center,
  Text,
  Spinner,
  useDisclosure,
  Select,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "../App.css";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import ValueFilterBook from "./valueFilterBook";
export default function FilterBook() {
  const IMG = process.env.REACT_APP_API_IMAGE_URL;
  const orderSelector = useSelector((state) => state.login.order);
  const userSelector = useSelector((state) => state.login.auth);
  const quantitySelector = useSelector((state) => state.login.qty);
  const dispatch = useDispatch();
  let t = localStorage.getItem("auth");
  const toast = useToast();
  const nav = useNavigate();
  const { categoryId } = useParams();
  const [value, setValue] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(8);
  const [rows, setRows] = useState(0);
  const [pages, setPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState("");
  const [data, setData] = useState(parseInt(categoryId));
  async function fetchProduct() {
    try {
      setIsLoading(true);
      if (categoryId) {
        let url = `/stock/price?price=${price}&place=${orderSelector.BranchId}&category=${data}&page=${page}&limit=${limit}`;
        const response = await api().get(url);
        setValue(response.data.Stock);
        setPage(response.data.page);
        setRows(response.data.totalRows);
        setPages(response.data.totalPage);
      } else {
        let url = `/stock/price?price=${price}&place=${orderSelector.BranchId}&page=${page}&limit=${limit}`;
        const response = await api().get(url);
        setValue(response.data.Stock);
        setPage(response.data.page);
        setRows(response.data.totalRows);
        setPages(response.data.totalPage);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (categoryId) {
      setData(parseInt(categoryId));
    }
  }, [categoryId, data, page]);

  useEffect(() => {
    fetchProduct();
  }, [price, data, categoryId, page]);

  async function add(idx) {
    try {
      if (userSelector.username) {
        await api().post("cart/v1", {
          qty: 1,
          UserId: userSelector.id,
          StockId: value[idx].id,
        });
        dispatch({
          type: "qty",
          payload: {
            quantity: quantitySelector.quantity + 1,
          },
        });
      } else {
        Swal.fire("You need to login first?", "", "question");
        nav("/login");
      }
    } catch (error) {
      toast({
        title: error.response.data,
        position: "top",
        containerStyle: {
          maxWidth: "30%",
        },
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  }
  const onChangeCategory = (e) => {
    setData(parseInt(e));
    nav(`/products/filter/${parseInt(e)}`);
    if (e == "") {
      setData(null);
      nav(`/products/filter`);
    }
  };
  const fetchCategori = async () => {
    let response = await api().get(`/category`);
    setCategory(response.data.result);
  };
  useEffect(() => {
    fetchCategori();
  }, []);
  const changePage = ({ selected }) => {
    setPage(selected);
  };
  const onChange = (e) => {
    const value = e.target.value;
    setPrice(value);
  };
  const percent = (a, b) => {
    let result = (a / 100) * b;
    return result;
  };
  return (
    <>
      <Center my={3} display={"flex"} flexDirection={"column"}>
        <Box
          display={"flex"}
          flexDir={{ base: "column", sm: "column", md: "column", lg: "row" }}
          h={"78vh"}
          overflowY={"scroll"}
          sx={{
            "&::-webkit-scrollbar": {
              width: "5px",
              borderRadius: "8px",
              backgroundColor: `rgba(0, 0, 0, 0.05)`,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: `#cce6ff`,
            },
          }}
          p={3}
          gap={3}
          alignItems={{
            base: "center",
            sm: "center",
            md: "center",
            lg: "flex-start",
          }}
        >
          <Box
            w={{ base: "800px", lg: "400px" }}
            justifyContent={{ base: "space-evenly", lg: "center" }}
            display={"flex"}
            px={10}
            py={3}
            alignItems={{
              base: "center",
              sm: "center",
              md: "center",
              lg: "flex-start",
            }}
          >
            <Box
              display={"flex"}
              flexDir={{
                base: "column",
                sm: "column",
                md: "row",
                lg: "column",
              }}
              gap={5}
            >
              <Heading as="h3" size="lg">
                Filter
              </Heading>
              <Box gap={3} display={"flex"} flexDir={"column"}>
                <Heading as="h4" size="md">
                  Kategori
                </Heading>
                <Select
                  onChange={(e) => onChangeCategory(e.target.value)}
                  placeholder="Pilih Kategori"
                  value={data}
                  w={"200px"}
                  mr={8}
                >
                  {category.map((cate, idx) => (
                    <option key={idx} value={cate.id}>
                      {cate.category}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box gap={3} display={"flex"} flexDir={"column"}>
                <Heading as="h4" size="md">
                  Harga
                </Heading>
                <Select
                  onChange={onChange}
                  placeholder="Pilih"
                  value={price}
                  w={"200px"}
                  mr={8}
                >
                  <option value="ASC">Harga Termurah</option>
                  <option value="DESC">Harga Termahal</option>
                </Select>
              </Box>
            </Box>
          </Box>
          <Box
            w={{
              base: "300px",
              sm: "450px",
              md: "600px",
              lg: "750px",
              xl: "900px",
            }}
            display={"flex"}
            gap={3}
            p={3}
            flexWrap={"wrap"}
            justifyContent={{
              base: "center",
              sm: "center",
              md: "center",
              lg: "flex-start",
            }}
          >
            {isLoading ? (
              <Box
                display={"flex"}
                justifyContent={"center"}
                flexDir={"column"}
                mx={"auto"}
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Box>
            ) : (
              <Box
                display={"flex"}
                flexDir={"column"}
                gap={5}
                w={"900px"}
                justifyContent={{
                  base: "center",
                  sm: "center",
                  md: "center",
                  lg: "center",
                }}
              >
                <Box
                  display={"flex"}
                  flexWrap={"wrap"}
                  gap={5}
                  justifyContent={{
                    base: "center",
                    sm: "center",
                    md: "center",
                    lg: "flex-start",
                  }}
                >
                  {value.map((val, idx) => (
                    <ValueFilterBook
                      val={val}
                      idx={idx}
                      add={add}
                      percent={percent}
                    />
                  ))}
                </Box>
                <Text>
                  Total Data: {rows} Page: {rows ? page + 1 : 0} of {pages}
                </Text>
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
                  initialPage={page}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Center>
    </>
  );
}
