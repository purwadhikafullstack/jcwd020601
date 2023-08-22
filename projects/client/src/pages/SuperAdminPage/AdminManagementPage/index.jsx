import AddAdminButton from "./AddBranchAdmin";
import AdminTables from "./AdminTables";
import { api } from "../../../api/api";
import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import NavbarFooter from "../NavbarFooter";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
export default function SuperAdminPageBranchAdmin() {
  const [admins, setAdmins] = useState([]);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(0);
  async function getAllAdminBranch() {
    const result = await api().post(`/admin/allAdminP?page=${page}&limit=${5}`);
    setPage(result.data.page);
    setRows(result.data.totalRows);
    setPages(result.data.totalPage);
    console.log(result);
    setAdmins(result.data.Admin);
  }
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
                      pages={pages}
                      rows={rows}
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
