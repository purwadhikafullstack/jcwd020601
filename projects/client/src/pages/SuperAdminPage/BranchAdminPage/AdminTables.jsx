import {
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../../api/api";

export default function AdminTables(props) {
  useEffect(() => {
    props.getAllAdminBranch();
  }, []);
  return (
    <>
      <Flex>
        <Flex>
          <Flex
            onClick={() => {
              console.log(props.admins);
            }}
          >
            lol
          </Flex>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Admin</Th>
                  <Th>Role</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>BranchId</Th>
                  <Th>BranchName</Th>
                </Tr>
              </Thead>
              <Tbody bgColor={"white"}>
                {props.admins.map((val) => {
                  return (
                    <Tr color={"#2c5282"} border={"2px #2c5282 solid"}>
                      <Td borderRight={"2px #2c5282 solid"}>{val.name}</Td>
                      <Td borderRight={"2px #2c5282 solid"}>{val.role}</Td>
                      <Td borderRight={"2px #2c5282 solid"}>{val.email}</Td>
                      <Td borderRight={"2px #2c5282 solid"}>{val.phone}</Td>
                      <Td borderRight={"2px #2c5282 solid"}>{val.BranchId}</Td>
                      <Td>{val.Branch.name}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Flex>
    </>
  );
}
