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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import ModalAddAddress from "./ModalAddAddress";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import YupPassword from "yup-password";
import * as Yup from "yup";
import { api } from "../../../api/api";
import { MdClose } from "react-icons/md";
import EditAddress from "./EditAddress";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Helpers from "./EditAddressHelper";
import AddAddressHelpers from "./AddAddressHelper";
export default function DaftarAlamat(props) {
  const token = JSON.parse(localStorage.getItem("auth"));
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const modalAddAddress = useDisclosure();
  const dispatch = useDispatch();
  const [selectIsMain, setSelectIsMain] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [province, setProvince] = useState();
  const [cities, setCities] = useState([1, 2]);
  const [pos, setPos] = useState();
  const [provinceId, setProvinceId] = useState();
  const [cityId, setCityId] = useState();
  const nav = useNavigate();
  YupPassword(Yup);
  const formikAddress = useFormik({
    initialValues: {
      UserId: props.userSelector.id,
    },
    validationSchema: Helpers.validationSchemaAddress,
    onSubmit: async () => {
      await api.post("/address/v1?token=" + token, formikAddress.values);
      AddAddressHelpers.submit({
        Swal,
        modalAddAddress,
        dispatch,
        nav,
        fetchUserAddresses: props.fetchUserAddresses,
      });
      formikAddress.resetForm();
    },
  });
  useEffect(() => {
    if (props.userSelector.email) {
      props.fetchUserAddresses();
    }
  }, []);
  async function fetchCity() {
    setPos();
    setCities([]);
    await api
      .get("/city/v1/" + provinceId)
      .then((res) => {
        setCities(res.data.result);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  async function fetchPos() {
    setPos();
    await api.get("/city/v2/" + cityId).then((res) => {
      setPos(res.data.result);
    });
  }
  async function inputHandlerAddress(input) {
    const { value, id } = input.target;
    const tempobject = {};
    tempobject[id] = value.split("#")[0];
    if (id == "province") {
      setProvinceId(value.split("#")[0]);
      formikAddress.setFieldValue(id, value);
    } else if (id == "city") {
      setCityId(value.split("#")[0]);
      formikAddress.setFieldValue(id, value);
    } else formikAddress.setFieldValue(id, value);
  }
  useEffect(() => {
    fetchCity();
  }, [formikAddress.values.province]);
  useEffect(() => {
    fetchPos();
  }, [formikAddress.values.city]);
  return (
    <Flex flexDir={"column"} gap={"20px"} pr={"50px"}>
      <Flex gap={"20px"}>
        <Button
          w={"160px"}
          onClick={() => {
            modalAddAddress.onOpen();
          }}
          colorScheme="facebook"
        >
          Tambah Alamat
        </Button>
        <Button
          w={"160px"}
          fontSize={"0.9rem"}
          onClick={() => {
            setSelectIsMain(!selectIsMain);
          }}
          colorScheme="facebook"
        >
          Change Main Address
        </Button>
      </Flex>
      {props.userAddresses.map((val) => {
        return (
          <>
            <EditAddress
              selectIsMain={selectIsMain}
              setSelectIsMain={setSelectIsMain}
              phoneRegExp={phoneRegExp}
              userSelector={props.userSelector}
              useState={useState}
              fetchUserAddresses={props.fetchUserAddresses}
              inputHandlerAddress={inputHandlerAddress}
              nav={nav}
              addressUser={val}
            />
          </>
        );
      })}
      <Modal
        closeOnOverlayClick={false}
        scrollBehavior="inside"
        isOpen={modalAddAddress.isOpen}
        onClose={modalAddAddress.onClose}
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
            <Center fontWeight={700} color={"white"}>
              Add Address
            </Center>
            <Flex w={"70%"} flexDir={"row-reverse"}>
              <Button
                w={"30px"}
                onClick={() => {
                  modalAddAddress.onClose();
                  formikAddress.resetForm();
                }}
              >
                <Icon fontSize={"30px"} as={MdClose}></Icon>
              </Button>
            </Flex>
          </ModalHeader>
          <ModalBody maxW="500px">
            <ModalAddAddress
              pos={pos}
              setPos={setPos}
              fetchPos={fetchPos}
              cities={cities}
              setCities={setCities}
              fetchCity={fetchCity}
              setProvince={setProvince}
              province={province}
              setProvinces={setProvinces}
              provinces={provinces}
              formikAddress={formikAddress}
              onClose={modalAddAddress.onClose}
              inputHandlerAddress={inputHandlerAddress}
            ></ModalAddAddress>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
