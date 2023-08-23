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
import { api } from "../api/api";

export default function Shipping(props) {
  const dispatch = useDispatch();
  const [service, setService] = useState([]);
  const [etd, setEtd] = useState();
  // console.log(etd);

  async function fetch() {
    try {
      // console.log(props.courier);
      // console.log(props.weight);
      const ship = await api().post("order/shipping", {
        origin: "501",
        destination: "114",
        weight: props.weight,
        courier: props.courier,
      });
      return setService(ship.data);
    } catch (error) {
      console.log(error);
    }
  }

  // console.log(service.costs[0].cost[0].values);
  // console.log(service[0].cost[0].value);
  console.log(service);

  useEffect(() => {
    fetch();
  }, [props.courier]);

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
        <Select
          placeholder="Select shipping method"
          onChange={(e) => {
            props.setCourier(e.target.value);
            // fetch();
          }}
        >
          <option value="jne">JNE</option>
          <option value="pos">POS</option>
          <option value="tiki">TIKI</option>
        </Select>
        <Select
          placeholder="Select shipping service"
          onChange={(e) => {
            // setEst(e.target.value)
            setEtd(e.target.id);
            props.setShipping(e.target.value);
          }}
        >
          {/* map */}
          {service.map((val, idx) => (
            <option
              id={service[idx].cost[0].etd}
              value={service[idx].cost[0].value}
            >
              {val.service}
            </option>
          ))}
        </Select>

        <TableContainer>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>Courier</Td>
                <Td>{props.courier}</Td>
              </Tr>
              <Tr>
                <Td>Estimated to arrive</Td>
                <Td>{etd} days</Td>
              </Tr>
              <Tr>
                <Td>Cost</Td>
                <Td>Rp {Number(props.shipping).toLocaleString("id-ID")},-</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Flex>
  );
}
