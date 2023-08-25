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
import { api } from "../../api/api";

export default function ModalFilterSales(props) {
  const [branch, setBranch] = useState([]);
  const [filter, setFilter] = useState({
    time: "allTime",
    BranchId: "",
  });
  function inputHandler(input) {
    const { value, id } = input.target;
    const tempobject = { ...filter };
    tempobject[id] = value;
    setFilter(tempobject);
    console.log(tempobject);
  }
  async function fetchBranchName() {
    const result = await api().get(`/branch`);
    setBranch(result.data);
    console.log(result.data);
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
            <Center w={"130px"} fontWeight={700} color={"white"}>
              Sales Filter
            </Center>
            <Flex w={"70%"} flexDir={"row-reverse"}>
              <Button
                w={"30px"}
                onClick={() => {
                  props.modalFilter.onClose();
                  setFilter({});
                }}
              >
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
                    id="BranchId"
                    variant={"filled"}
                  >
                    <option display="none" disabled selected hidden>
                      Select BranchName
                    </option>
                    {branch.map((val) => {
                      return (
                        <>
                          <option value={val.id}>{val.name}</option>
                        </>
                      );
                    })}
                  </Select>
                </Flex>
                <Flex flexDir={"column"} gap={"5px"} w={"100%"}>
                  <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                    Date format
                  </Flex>
                  <Select onChange={inputHandler} id="time" variant={"filled"}>
                    <option display="none" disabled selected hidden>
                      Select Date Format
                    </option>
                    <option value={"allTime"}>All Time</option>
                    <option value={"monthly"}>Monthly</option>
                    <option value={"weekly"}>Weekly</option>
                  </Select>
                </Flex>
                <Flex mt={"20px"} flexDir={"row-reverse"} gap={"20px"}>
                  <Button
                    onClick={() => {
                      setFilter({});
                      props.modalFilter.onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      props.modalFilter.onClose();
                      props.submitFilter(filter);
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
