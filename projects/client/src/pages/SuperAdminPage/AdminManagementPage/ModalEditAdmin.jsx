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
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { api } from "../../../api/api";

export default function ModalEditAdmin(props) {
  const modalEditAdmin = useDisclosure();
  const initialState = {
    name: props.name,
    email: props.email,
    phone: props.phone,
  };
  const [{ name, email, phone, password }, setState] = useState(initialState);
  async function submitEdit() {
    const result = await api().patch(`/admin/v2/` + props.id, {
      name,
      email,
      phone,
      password,
    });
    props.getAllAdminBranch();
  }
  async function deleteAdmin() {
    const result = await api().delete(`/admin/v3/` + props.id);
    props.getAllAdminBranch();
  }
  function inputHandler(input) {
    const { value, id } = input.target;
    const tempobject = { name, email, phone };
    tempobject[id] = value;
    setState((prevState) => ({ ...prevState, [id]: value }));
  }
  return (
    <>
      <Flex>
        <Button
          bgColor={"#2c5282"}
          color={"white"}
          onClick={modalEditAdmin.onOpen}
        >
          Edit
        </Button>
        <Modal
          closeOnOverlayClick={false}
          scrollBehavior="inside"
          isOpen={modalEditAdmin.isOpen}
          onClose={modalEditAdmin.onClose}
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
                <Button
                  w={"30px"}
                  onClick={() => {
                    modalEditAdmin.onClose();
                    setState(initialState);
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
                      Name
                    </Flex>
                    <Input
                      value={name}
                      onChange={inputHandler}
                      id="name"
                      w={"100%"}
                      variant={"filled"}
                    ></Input>
                  </Flex>
                  <Flex flexDir={"column"} gap={"5px"}>
                    <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                      Email
                    </Flex>
                    <Input
                      value={email}
                      onChange={inputHandler}
                      id="email"
                      w={"100%"}
                      variant={"filled"}
                    ></Input>
                  </Flex>
                  <Flex flexDir={"column"} gap={"5px"}>
                    <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                      Phone
                    </Flex>
                    <Input
                      value={phone}
                      onChange={inputHandler}
                      id="phone"
                      w={"100%"}
                      variant={"filled"}
                    ></Input>
                  </Flex>
                  <Flex flexDir={"column"} gap={"5px"}>
                    <Flex fontWeight={"600"} fontSize={"1.1rem"}>
                      Password
                    </Flex>
                    <Input
                      onChange={inputHandler}
                      id="password"
                      w={"100%"}
                      variant={"filled"}
                    ></Input>
                  </Flex>
                  <Flex mt={"20px"} flexDir={"row-reverse"} gap={"20px"}>
                    <Button
                      onClick={() => {
                        modalEditAdmin.onClose();
                        setState(initialState);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        modalEditAdmin.onClose();
                        submitEdit();
                      }}
                      bgColor={"#385898"}
                      color={"white"}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        modalEditAdmin.onClose();
                        deleteAdmin();
                      }}
                      bgColor={"#385898"}
                      color={"white"}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
}
