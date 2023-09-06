import {
  Button,
  Center,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { api } from "../../../api/api";

export default function ModalFilter(props) {
  const transactionStatuses = [
    "waiting for payment",
    "waiting for payment confirmation",
    "process",
    "sending",
    "delivery confirm",
    "canceled",
  ];
  const [branch, setBranch] = useState([]);
  function inputHandler(input) {
    const { value, id } = input.target;
    const tempobject = { ...props.filter };
    tempobject[id] = value;
    props.setFilter(tempobject);
  }
  async function fetchBranchName() {
    const result = await api().get(`/branch`);
    setBranch(result.data);
  }
  useEffect(() => {
    fetchBranchName();
  }, []);
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        scrollBehavior="inside"
        isOpen={props.modalFilter.isOpen}
        onClose={props.modalFilter.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent maxH={"500px"} maxW="500px">
          <ModalHeader
            w={"100%"}
            px={"10px"}
            display={"flex"}
            flexDir={"row"}
            justifyContent={"center"}
            bgColor={"#385898"}
          >
            <Center w={"200px"} fontWeight={700} color={"white"}>
              Transaction Filter
            </Center>
            <Flex w={"70%"} flexDir={"row-reverse"}>
              <Button w={"30px"} onClick={props.modalFilter.onClose}>
                <Icon fontSize={"30px"} as={MdClose}></Icon>
              </Button>
            </Flex>
          </ModalHeader>
          <ModalBody maxW="500px">
            <Flex mb={"10px"}>
              <Flex flexDir={"column"} gap={"10px"} w={"100%"}>
                <Flex flexDir={"column"} gap={"5px"} w={"100%"}>
                  <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                    BranchName
                  </Flex>
                  <Select
                    onChange={inputHandler}
                    id="BranchName"
                    variant={"filled"}
                    placeholder="Select BranchName"
                  >
                    {branch.map((val) => {
                      return (
                        <>
                          <option value={val.name}>{val.name}</option>
                        </>
                      );
                    })}
                  </Select>
                </Flex>
                <Flex flexDir={"column"} gap={"5px"}>
                  <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                    invoiceCode
                  </Flex>
                  <Input
                    onChange={inputHandler}
                    id="invoiceCode"
                    variant={"filled"}
                  ></Input>
                </Flex>{" "}
                <Flex flexDir={"column"} gap={"5px"}>
                  <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                    Transaction Status
                  </Flex>
                  <Select
                    onChange={inputHandler}
                    id="status"
                    variant={"filled"}
                    placeholder="Select Status"
                  >
                    {transactionStatuses.map((val) => {
                      return (
                        <>
                          <option value={val}>{val}</option>
                        </>
                      );
                    })}
                  </Select>
                </Flex>{" "}
                <Flex flexDir={"column"} gap={"5px"}>
                  <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                    Created After
                  </Flex>
                  <Input
                    onChange={inputHandler}
                    id="after"
                    type="datetime-local"
                    variant={"filled"}
                  ></Input>
                </Flex>
                <Flex flexDir={"column"} gap={"5px"}>
                  <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                    Created Before
                  </Flex>
                  <Input
                    onChange={inputHandler}
                    id="before"
                    type="datetime-local"
                    variant={"filled"}
                  ></Input>
                </Flex>{" "}
                <Flex mt={"20px"} flexDir={"row-reverse"} gap={"20px"}>
                  <Button onClick={props.modalFilter.onClose}>Cancel</Button>
                  <Button
                    onClick={() => {
                      props.modalFilter.onClose();
                      props.submitFilter();
                    }}
                    bgColor={"#385898"}
                    color={"white"}
                  >
                    Search
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
