import { Button, Center, Flex, Icon, Input, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { api } from "../api/api";
import axios from "axios";

export default function ModalAddAdmin(props) {
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
            <Flex fontWeight={"500"}>Admin-Branch Name</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                id="adminName"
                variant={"flushed"}
                placeholder="Contoh : (Rumah,Kantor)"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}></Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>Email</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                id="email"
                variant={"flushed"}
                placeholder="Receiver's Name"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}></Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>No. Handphone</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                id="phone"
                variant={"flushed"}
                placeholder="Receiver's Phone Number"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}></Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>Password</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                id="password"
                variant={"flushed"}
                placeholder="Receiver's Phone Number"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}></Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>BranchId</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                id="BranchId"
                variant={"flushed"}
                placeholder="Receiver's Phone Number"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}></Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>Branch-Province</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                id="province"
                variant={"flushed"}
                placeholder="Receiver's Phone Number"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}></Flex>
          </Flex>
          <Flex flexDir={"column"}>
            <Flex fontWeight={"500"}>Branch-City</Flex>
            <Flex>
              <Input
                _placeholder={{ opacity: "1" }}
                id="city"
                variant={"flushed"}
                placeholder="Contoh : (Rumah,Kantor)"
              ></Input>
            </Flex>
            <Flex color={"red"} fontSize={"0.8rem"}></Flex>
          </Flex>
          <Flex py={"20px"} w={"100%"}>
            <Button w={"100%"} borderRadius={"10px"}>
              Save Address
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
