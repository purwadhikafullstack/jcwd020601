import {
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
import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Shipping(props) {
  const [service, setService] = useState([]);
  const [etd, setEtd] = useState();
  const [citycode, setCityCode] = useState();

  async function cityCode() {
    const result = await api().post("city/order", {
      BranchId: props.BranchId,
      AddressId: props.AddressId,
    });
    setCityCode(result.data);
  }
  async function fetch() {
    try {
      const ship = await api().post("order/shipping", {
        origin: citycode.origin,
        destination: citycode.destination,
        weight: props.weight,
        courier: props.courier,
      });
      return setService(ship.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    cityCode();
    fetch();
  }, [props.courier]);

  return (
    <Flex
      boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
      width={{ base: "19rem", md: "auto" }}
      padding={{ base: "0.5rem", lg: "2rem" }}
      borderRadius={"0.7rem"}
      flexDir={"column"}
      justifyContent={"center"}
      gap={"1rem"}
    >
      <Flex alignItems={"center"}>
        <Icon as={MdLocationOn}></Icon>
        Destination: {citycode?.adress}
      </Flex>
      <Flex
        width={{ base: "18rem", md: "auto" }}
        flexDir={"column"}
        gap={".5rem"}
      >
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
