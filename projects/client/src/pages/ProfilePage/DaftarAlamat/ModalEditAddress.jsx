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
import { MdClose } from "react-icons/md";
import ModalEditAddressContent from "./ModalEditAddressContent";

export default function ModalEditAddress(props) {
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        scrollBehavior="inside"
        isOpen={props.modalEditAddress.isOpen}
        onClose={props.modalEditAddress.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent maxH="500px" h={"500px"} maxW="500px">
          <ModalHeader
            bgColor={"#385898"}
            color={"white"}
            display={"flex"}
            justifyContent={"center"}
          >
            <Center fontWeight={700}>Edit Address</Center>
            <Flex w={"70%"} flexDir={"row-reverse"}>
              <Button
                w={"30px"}
                onClick={() => {
                  props.setReset(false);
                  props.formikAddress.resetForm();
                  props.modalEditAddress.onClose();
                  props.setState({ ...props.initialState });
                  props.setProvinceId(props.val.addressUser.ProvinceId);
                  props.setCityId(props.val.addressUser.CityId);
                  props.setFetchBoth(!props.fetchBoth);
                }}
              >
                <Icon fontSize={"30px"} as={MdClose}></Icon>
              </Button>
            </Flex>
          </ModalHeader>
          <ModalBody maxH="500px" h={"500px"} maxW="500px">
            <ModalEditAddressContent
              alamatLengkap={props.alamatLengkap}
              no_Handphone={props.no_Handphone}
              labelAlamat={props.labelAlamat}
              deleteAddress={props.deleteAddress}
              namaPenerima={props.namaPenerima}
              pos={props.pos}
              posCodes={props.posCodes}
              city={props.city}
              province={props.province}
              cities={props.cities}
              provinces={props.provinces}
              formikAddress={props.formikAddress}
              inputHandlerAddress={props.inputHandlerAddress}
            ></ModalEditAddressContent>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
