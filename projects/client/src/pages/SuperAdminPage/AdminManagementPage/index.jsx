import AddAdminButton from "./AddBranchAdmin";
import AdminTables from "./AdminTables";
import { api } from "../../../api/api";
import { useEffect, useState } from "react";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import NavbarFooter from "../NavbarFooter";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
export default function SuperAdminPageBranchAdmin() {
  const [admins, setAdmins] = useState([]);
  const [filter, setFilter] = useState();
  const [filtered, setFiltered] = useState(false);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(0);
  const modalFilter = useDisclosure();

  async function submitFilter() {
    const result = await api().post(
      `/admin/filter?page=${page}&limit=${5}`,
      filter
    );
    setPage(result.data.page);
    setRows(result.data.totalRows);
    setPages(result.data.totalPage);
    setAdmins(result.data.Admin);
    setFiltered(true);
  }
  async function getAllAdminBranch() {
    const result = await api().post(`/admin/allAdminP?page=${page}&limit=${5}`);
    setPage(result.data.page);
    setRows(result.data.totalRows);
    setPages(result.data.totalPage);
    setAdmins(result.data.Admin);
  }
  useEffect(() => {
    if (filter) {
      submitFilter();
    } else {
      getAllAdminBranch();
    }
  }, [page]);
  const changePage = ({ selected }) => {
    // console.log(selected);
    setPage(selected);
  };

  return (
    <>
      <Flex w={"100%"}>
        <Sidebar />
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
          <Navbar />
          {admins ? (
            <Flex>
              <Flex marginLeft={60} bgColor={"#fbfbfb"} w={"100%"}>
                <Flex flexDir={"column"} w={"100%"}>
                  <Flex w={"100%"}>
                    <AdminTables
                      setFilter={setFilter}
                      setFiltered={setFiltered}
                      filter={filter}
                      filtered={filtered}
                      modalFilter={modalFilter}
                      submitFilter={submitFilter}
                      pages={pages}
                      page={page}
                      changePage={changePage}
                      admins={admins}
                      setAdmins={setAdmins}
                      getAllAdminBranch={getAllAdminBranch}
                    />
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <></>
          )}
          <NavbarFooter />
        </Box>
      </Flex>
    </>
  );
}
