import { Button, Center, Flex, Icon, Input, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { api } from "../api/api";
import axios from "axios";

export default function ModalAddAdmin(props) {
  useEffect(() => {
    const fetchData = async () => {
      const data = await api.get("province").then((res) => {
        props.setProvinces(res.data.result);
      });
    };
    fetchData();
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
            <Flex fontSize={"1.2rem"} fontWeight={700}>
              Branch-Admin
            </Flex>
            <Flex fontWeight={"500"}>Name</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                id="name"
                onChange={props.inputHandlerAddress}
                variant={"flushed"}
                placeholder="Branch-Admin's Name"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.name}
            </Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex
              fontWeight={"500"}
              onClick={() => {
                console.log(props.formikAddress.values);
              }}
            >
              Email
            </Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                onChange={props.inputHandlerAddress}
                id="email"
                variant={"flushed"}
                // value={props.namaPenerima}
                placeholder="Branch-Admin's Email"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.email}
            </Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>Password</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                onChange={props.inputHandlerAddress}
                id="password"
                variant={"flushed"}
                placeholder="Branch-Admin's Password"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.password}
            </Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>Phone</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                onChange={props.inputHandlerAddress}
                id="phone"
                variant={"flushed"}
                placeholder="Branch-Admin's Phone Number"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.phone}
            </Flex>
          </Flex>
          <Flex fontSize={"1.2rem"} fontWeight={700}>
            Branch
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>Name</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                onChange={props.inputHandlerAddress}
                id="branchName"
                variant={"flushed"}
                placeholder="Branch Name"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.branchName}
            </Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>Alamat Lengkap</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                onChange={props.inputHandlerAddress}
                id="alamatLengkap"
                variant={"flushed"}
                placeholder="Complete Address"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.alamatLengkap}
            </Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>Province</Flex>
            <Select
              id="province"
              onChange={async (val) => {
                await props.inputHandlerAddress(val);
              }}
              variant="flushed"
            >
              <option display="none" disabled selected hidden>
                Select Province
              </option>
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
                // console.log(props.formikAddress.values);
                // console.log(props.pos);
              }}
            >
              City
            </Flex>
            <Select
              id="city"
              onChange={(val) => {
                props.inputHandlerAddress(val);
              }}
              variant="flushed"
            >
              <option display="none" disabled selected hidden>
                Select City
              </option>
              {props?.cities.map((val) => (
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
              onChange={props.inputHandlerAddress}
              variant="flushed"
            >
              <option display="none" disabled selected hidden>
                Select PosCode
              </option>

              <option value={props.pos?.postal_code}>
                {props.pos?.postal_code}
              </option>
            </Select>
            <Flex color={"red"} fontSize={"0.8rem"}>
              {props.formikAddress.errors.pos}
            </Flex>
          </Flex>

          <Flex py={"20px"} w={"100%"}>
            <Button
              w={"100%"}
              borderRadius={"10px"}
              onClick={props.formikAddress.handleSubmit}
            >
              Create Branch
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
