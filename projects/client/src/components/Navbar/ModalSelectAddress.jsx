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
} from "@chakra-ui/react";
import SelectAddress from "../../pages/ProfilePage/SelectAddress";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ModalSelectAddress({
  modalSelectAddress,
  userAddresses,
  userAddress,
  setUserAddress,
}) {
  const userSelector = useSelector((state) => state.login.auth);
  const nav = useNavigate();

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        scrollBehavior="inside"
        isOpen={modalSelectAddress.isOpen}
        onClose={modalSelectAddress.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent maxH={"500px"} maxW="500px">
          <ModalHeader
            bgColor={"#385898"}
            color={"white"}
            w={"100%"}
            px={"10px"}
            display={"flex"}
            flexDir={"row"}
            justifyContent={"center"}
          >
            <Center fontWeight={700}>Select Address</Center>
            <Flex w={"70%"} flexDir={"row-reverse"}>
              <Button
                w={"30px"}
                onClick={() => {
                  modalSelectAddress.onClose();
                }}
              >
                <Icon fontSize={"30px"} as={MdClose}></Icon>
              </Button>
            </Flex>
          </ModalHeader>

          <ModalBody
            maxW="500px"
            py={"20px"}
            onClick={() => {
              console.log("sakd");
            }}
          >
            {userAddresses[0] ? (
              <Flex flexDir={"column"} gap={"20px"} pr={"50px"}>
                {userAddresses.map((val) => {
                  return (
                    <>
                      <SelectAddress
                        userSelector={userSelector}
                        modalSelectAddress={modalSelectAddress}
                        userAddress={userAddress}
                        setUserAddress={setUserAddress}
                        address={val}
                        id={val.id}
                        province={val.province}
                        city={val.city}
                        pos={val.pos}
                        labelAlamat={val.labelAlamat}
                        isMain={val.isMain}
                        no_Handphone={val.no_Handphone}
                        alamatLengkap={val.alamatLengkap}
                        namaPenerima={val.namaPenerima}
                      />
                    </>
                  );
                })}
              </Flex>
            ) : (
              <Center
                flexDir={"column"}
                w={"100%"}
                pt={"20px"}
                pb={"40px"}
                gap={"30px"}
              >
                <Flex color={"#b3b4ba"} fontSize={"1.4rem"} fontWeight={"600"}>
                  You Have No Addresses To Pick From
                </Flex>
                {userSelector.username ? (
                  <Button
                    bgColor={"#385898"}
                    color={"white"}
                    _hover={{ cursor: "pointer", color: "#32aced" }}
                    onClick={() => nav("/profile")}
                    fontSize={"1.4rem"}
                    fontWeight={"600"}
                  >
                    Create One
                  </Button>
                ) : (
                  <Button
                    bgColor={"#385898"}
                    color={"white"}
                    _hover={{ cursor: "pointer", color: "#32aced" }}
                    onClick={() => nav("/login")}
                    fontSize={"1.4rem"}
                    fontWeight={"600"}
                  >
                    Require Login
                  </Button>
                )}
              </Center>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
