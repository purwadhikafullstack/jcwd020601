import {
  Button,
  Center,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
export default function ModalSort(props) {
  function inputHandler(input) {
    const { value, id } = input.target;
    const tempobject = { ...props.sort };
    tempobject[id] = value;
    props.setSort(tempobject);
  }
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        scrollBehavior="inside"
        isOpen={props.modalSort.isOpen}
        onClose={props.modalSort.onClose}
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
              Sort
            </Center>
            <Flex w={"70%"} flexDir={"row-reverse"}>
              <Button
                w={"30px"}
                onClick={() => {
                  props.setSort({
                    asc: "ASC",
                  });
                  props.modalSort.onClose();
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
                    Sorted By
                  </Flex>
                  <Select
                    onChange={inputHandler}
                    id="sortedBy"
                    variant={"filled"}
                  >
                    <option display="none" disabled selected hidden>
                      Sorted by....
                    </option>
                    <option value="email">Email</option>
                    <option value="name">Admin-Name</option>
                    <option value="branchName">Branch Name</option>
                  </Select>
                </Flex>
                <Flex flexDir={"column"} gap={"5px"}>
                  <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                    Ascending or Descending
                  </Flex>
                  <Select
                    value={props.sort.asc}
                    onChange={inputHandler}
                    id="asc"
                    variant={"filled"}
                  >
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                  </Select>
                </Flex>{" "}
                <Flex mt={"20px"} flexDir={"row-reverse"} gap={"20px"}>
                  <Button
                    onClick={() => {
                      props.setSort({
                        asc: "ASC",
                      });
                      props.modalSort.onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      props.modalSort.onClose();
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
