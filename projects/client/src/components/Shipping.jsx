import {
  Box,
  Button,
  Flex,
  Icon,
  Select,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineDown } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Shipping(props) {
  const dispatch = useDispatch();

  const [method, setMethod] = useState({
    courier: "",
    origin: "",
    destination: "",
    weight: "",
  });
  // setMethod()
  function fungsi() {
    try {
    } catch (error) {
      console.log(error);
    }
  }
  // useEffect(() => {
  //   fungsi();
  // }, []);
  return (
    <Flex
      boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
      padding={"1rem 2rem"}
      borderRadius={"0.7rem"}
      flexDir={"column"}
      justifyContent={"center"}
      gap={"1rem"}
    >
      <Flex alignItems={"center"}>
        <Icon as={MdLocationOn}></Icon>
        Alamat Tujuan Pengiriman
      </Flex>
      <Flex flexDir={"column"} gap={".5rem"}>
        <Select placeholder="Select shipping method">
          <option value="jne">JNE</option>
          <option value="pos">POS</option>
          <option value="tiki">TIKI</option>
        </Select>
        <Select placeholder="Select shipping service">
          <option value="option1">a</option>
          <option value="option2">b</option>
          <option value="option3">c</option>
        </Select>

        <TableContainer>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>Courier</Td>
                <Td>JNE - OKE</Td>
              </Tr>
              <Tr>
                <Td>Estimated to arrive</Td>
                <Td>3-4 days</Td>
              </Tr>
              <Tr>
                <Td>Cost</Td>
                <Td>Rp 20.000,-</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Flex>
  );
}
