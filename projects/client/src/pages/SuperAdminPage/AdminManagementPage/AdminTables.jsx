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
  Center,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ModalPayment from "../../../components/admin/transaction/ModalPayment";
import ModalDetails from "../../../components/admin/transaction/ModalDetails";
import ModalConfirm from "../../../components/admin/transaction/ModalConfirm";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { BsFilterSquareFill } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { AiTwotoneSetting } from "react-icons/ai";
import { GrSort } from "react-icons/gr";
import AddAdminButton from "./AddBranchAdmin";

export default function AdminTables(props) {
  const [trans, setTrans] = useState();
  const [filter, setFilter] = useState("");
  const [filtered, setFiltered] = useState("");
  const userSelector = useSelector((state) => state.login.auth);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(0);
  // const [limit, setLimit] = useState(6);
  const [rows, setRows] = useState(0);
  const modalFilter = useDisclosure();

  // GET

  useEffect(() => {
    props.getAllAdminBranch();
  }, [props.page]);

  //
  const changePage = ({ selected }) => {
    // console.log(selected);
    setPage(selected);
  };
  //
  return (
    <>
      <Box
        w={"100%"}
        bgColor={"#fbfbfb"}
        // display={"flex"}
        // flexDirection={"column"}
        // bgColor={"red"}
        py={"10px"}
      >
        <Flex ml={"10px"} px={"10px"}>
          <Flex flexDir={"column"} gap={"10px"} w={"100%"}>
            {/* <Flex w={"100%"} borderBottom={"2px solid #787875"} pb={"10px"}>
              <Flex alignItems={"center"} w={"100%"}>
                <Flex flexDir={"column"}>
                  <Flex
                    fontSize={"1.2rem"}
                    fontWeight={"700"}
                    width={"200px"}
                    color={"#2c5282"}
                    onClick={() => {
                      console.log(userSelector);
                    }}
                  >
                    {"Welcome, " + userSelector.admin_name}
                  </Flex>
                  <Flex
                    fontSize={"0.8rem"}
                    fontWeight={"600"}
                    color={"#787875"}
                  >
                    This is The Branch-Admins Section
                  </Flex>
                  <Flex></Flex>
                </Flex>
                <Center
                  w={"100%"}
                  fontWeight={"600"}
                  color={"#787875"}
                  fontSize={"1.2rem"}
                >
                  This is where you can see, add and edit other Branch-Admins
                  from different branches
                </Center>
              </Flex>
            </Flex> */}
            <Flex w={"100%"} borderBottom={"2px solid #787875"} pb={"10px"}>
              <Flex alignItems={"center"} w={"100%"}>
                <Flex flexDir={"column"}>
                  <Flex
                    fontSize={"1.2rem"}
                    fontWeight={"700"}
                    width={"200px"}
                    color={"#2c5282"}
                    onClick={() => {
                      console.log(userSelector);
                    }}
                  >
                    {"Welcome, " + userSelector.admin_name}
                  </Flex>
                  <Flex
                    fontSize={"0.8rem"}
                    fontWeight={"600"}
                    color={"#787875"}
                  >
                    This is The Branch-Admins Section
                  </Flex>
                  <Flex></Flex>
                </Flex>
                <Center
                  w={"100%"}
                  fontWeight={"600"}
                  color={"#787875"}
                  fontSize={"1.2rem"}
                  flexWrap={"wrap"}
                >
                  This is where you can see, add and edit other Branch-Admins
                  from different branches
                </Center>
              </Flex>
            </Flex>
            <Flex
              my={"10px"}
              pr={"15px"}
              w={"100%"}
              borderRadius={"8px"}
              justifyContent={"space-between"}
            >
              <Flex gap={"20px"} alignItems={"center"}>
                <Flex
                  border={"2px #2c5282 solid"}
                  p={"10px"}
                  width={"120px"}
                  borderRadius={"10px"}
                  fontWeight={700}
                  cursor={"pointer"}
                  onClick={() => {
                    setFilter();
                    setFiltered(false);
                  }}
                  bgColor={filtered ? "#2c5282" : "white"}
                  color={filtered ? "white" : "#2c5282"}
                >
                  {filtered ? "Filtered : On" : "Filtered : Off"}
                </Flex>
                <AddAdminButton getAllAdminBranch={props.getAllAdminBranch} />
              </Flex>
              <Flex alignItems={"center"} gap={"30px"} mr={"90px"}>
                <Button
                  onClick={modalFilter.onOpen}
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
                <Th>Admin-ID</Th>
                <Th>Admin-Name</Th>
                <Th>Branch-Name</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
                <Th>Check</Th>
              </Tr>
            </Thead>
            <Tbody>
              {props.admins?.map((val) => {
                return (
                  <Tr>
                    <Td>{val.id}</Td>
                    <Td>{val.name}</Td>
                    <Td>{val.Branch.name}</Td>
                    <Td>{val.phone}</Td>
                    <Td>{val.email}</Td>
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
            pageCount={props.pages}
            onPageChange={props.changePage}
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
        <Flex></Flex>
      </Box>
    </>
  );
}
