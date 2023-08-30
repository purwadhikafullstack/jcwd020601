import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  Center,
  Button,
} from "@chakra-ui/react";
import ModalPayment from "../../../components/admin/transaction/ModalPayment";
import ModalDetails from "../../../components/admin/transaction/ModalDetails";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import AddAdminButton from "./AddBranchAdmin";
import ModalFilter from "./ModalFilter";
import ModalEditAdmin from "./ModalEditAdmin";
import ModalSort from "./ModalSort";
export default function AdminTables(props) {
  const userSelector = useSelector((state) => state.login.auth);
  return (
    <>
      <Box w={"100%"} bgColor={"#fbfbfb"} py={"10px"}>
        <Flex ml={"10px"} px={"10px"}>
          <Flex flexDir={"column"} gap={"10px"} w={"100%"}>
            <Flex w={"100%"} borderBottom={"2px solid #787875"} pb={"10px"}>
              <Flex alignItems={"center"} w={"100%"}>
                <Flex flexDir={"column"}>
                  <Flex
                    fontSize={"1.2rem"}
                    fontWeight={"700"}
                    width={"200px"}
                    color={"#2c5282"}
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
                <Button
                  isDisabled={props.filtered ? false : true}
                  border={"2px #2c5282 solid"}
                  p={"10px"}
                  width={"120px"}
                  borderRadius={"10px"}
                  fontWeight={700}
                  onClick={() => {
                    props.getAllAdminBranch();
                    props.setFilter();
                    props.setFiltered(false);
                  }}
                  bgColor={props.filtered ? "#2c5282" : "white"}
                  color={props.filtered ? "white" : "#2c5282"}
                >
                  Close Filter
                </Button>
                <AddAdminButton getAllAdminBranch={props.getAllAdminBranch} />
              </Flex>
              <Flex alignItems={"center"} gap={"30px"} mr={"90px"}>
                <Button
                  onClick={props.modalFilter.onOpen}
                  bgColor={"#2c5282"}
                  color={"white"}
                >
                  Filter
                </Button>
                <Button
                  onClick={props.modalSort.onOpen}
                  bgColor={"#2c5282"}
                  color={"white"}
                >
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
                        <ModalEditAdmin
                          getAllAdminBranch={props.getAllAdminBranch}
                          id={val.id}
                          name={val.name}
                          phone={val.phone}
                          email={val.email}
                        />
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
        <ModalFilter
          setPage={props.setPage}
          filter={props.filter}
          setFilter={props.setFilter}
          modalFilter={props.modalFilter}
          submitFilter={props.submitFilter}
        />
        <ModalSort
          setPage={props.setPage}
          sort={props.sort}
          setSort={props.setSort}
          modalSort={props.modalSort}
          submitFilter={props.submitFilter}
        />
      </Box>
    </>
  );
}
