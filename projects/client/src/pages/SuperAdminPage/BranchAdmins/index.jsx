import { Flex } from "@chakra-ui/react";
import AddAdminButton from "./AddBranchAdmin";
import AdminTables from "./AdminTables";

export default function BranchAdmin() {
  return (
    <>
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
            <AddAdminButton />
          </Flex>
          <Flex>
            <AdminTables />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
