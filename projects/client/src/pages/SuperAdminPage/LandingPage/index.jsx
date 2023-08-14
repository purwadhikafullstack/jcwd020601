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

  async function getAllAdminBranch() {
    try {
      const admins = await api.get("/admin/adminbranch");
      setAdmins(admins.data);
      return admins.data;
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <Flex>
        <Sidebar />
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
          <Navbar />
          {admins ? (
            <Flex h={"1000px"} bgColor={"#f2f2f2"} pl={"20px"}>
              <Flex flexDir={"column"}>
                <Flex
                  py={"20px"}
                  fontSize={"2rem"}
                  fontWeight={"600"}
                  color={"#2c5282"}
                >
                  Manage Admin
                </Flex>
                <Flex>
                  <AddAdminButton getAllAdminBranch={getAllAdminBranch} />
                </Flex>
                <Flex>
                  <AdminTables
                    admins={admins}
                    setAdmins={setAdmins}
                    getAllAdminBranch={getAllAdminBranch}
                  />
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
