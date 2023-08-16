import { Button, Center, Flex, Icon, Input, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

import { api } from "../../../api/api";
import axios from "axios";

export default function ModalAddAddress(props) {
  useEffect(() => {
    const fetchData = async () => {
      const data = await axios
        .get("http://localhost:2000/province")
        .then((res) => {
          props.setProvinces(res.data.result);
        });
    };
    // call the function
    fetchData();
    // make sure to catch any error
    // .catch(console.error);
  }, []);
  return (
    <>
      <Flex
        maxW={"500px"}
        w={"430px"}
        margin={0}
        maxH={"600px"}
        flexDir={"column"}
      >
        <Flex gap={"10px"} flexDir={"column"}>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>Label Alamat</Flex>
            <Flex>
              <Input
                maxLength={32}
                _placeholder={{ opacity: "1" }}
                id="labelAlamat"
                onChange={props.inputHandlerAddress}
                variant={"flushed"}
                placeholder="Contoh : (Rumah,Kantor)"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.labelAlamat}
            </Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex
              fontWeight={"500"}
              onClick={() => {
                console.log(props.val);
                console.log(props.id);
              }}
            >
              Nama Penerima
            </Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                onChange={props.inputHandlerAddress}
                maxLength={32}
                id="namaPenerima"
                variant={"flushed"}
                value={props.namaPenerima}
                placeholder="Receiver's Name"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.namaPenerima}
            </Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>No. Handphone</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                onChange={props.inputHandlerAddress}
                maxLength={32}
                id="no_Handphone"
                variant={"flushed"}
                placeholder="Receiver's Phone Number"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.no_Handphone}
            </Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>Province</Flex>
            <Select
              id="province"
              onChange={(val) => {
                props.inputHandlerAddress(val);
              }}
              variant="flushed"
            >
              <option display="none" disabled selected hidden>
                Select Province
              </option>
              <option></option>
              {props.provinces.map((val) => (
                <option value={val.province_id + "#" + val.province}>
                  {val.province}
                </option>
              ))}
            </Select>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.province}
            </Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex
              fontWeight={"500"}
              onClick={() => {
                console.log(props.formikAddress.values);
                console.log(props.pos);
              }}
            >
              City
            </Flex>
            <Select
              id="city"
              onChange={props.inputHandlerAddress}
              variant="flushed"
            >
              <option display="none" disabled selected hidden>
                Select City
              </option>
              <option></option>
              {props.cities.map((val) => (
                <option value={val.city_id + "#" + val.city_name}>
                  {val.city_name}
                </option>
              ))}
            </Select>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.city}
            </Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>KodePos</Flex>
            <Select
              id="pos"
              onChange={(val) => {
                props.inputHandlerAddress(val);
                props.setPosCode(val.target.value);
              }}
              variant="flushed"
              value={props.posCode}
            >
              <option display="none" disabled selected hidden>
                Select PosCode
              </option>
              <option></option>
              <option value={props.pos?.postal_code}>
                {props.pos?.postal_code}
              </option>
            </Select>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.pos}
            </Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>Complete Address</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                onChange={props.inputHandlerAddress}
                id="alamatLengkap"
                variant={"flushed"}
                placeholder="Contoh : (Rumah,Kantor)"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.alamatLengkap}
            </Flex>
          </Flex>
          <Flex py={"20px"} w={"100%"}>
            <Button
              w={"100%"}
              borderRadius={"10px"}
              onClick={props.coolDown ? "" : props.formikAddress.handleSubmit}
              bgColor={"#385898"}
              color={"white"}
            >
              Save Address
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
