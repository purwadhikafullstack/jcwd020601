import {
  Box,
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
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { MdClose } from "react-icons/md";
import YupPassword from "yup-password";
import ModalEditAddress from "./ModalEditAddress";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
export default function EditAddress(val) {
  const toast = useToast();
  YupPassword(Yup);
  const [provinces, setProvinces] = val.useState([]);
  const [cities, setCities] = val.useState([]);
  const [posCodes, setPosCodes] = val.useState([]);
  const [provinceId, setProvinceId] = val.useState();
  const [cityId, setCityId] = val.useState();
  const token = JSON.parse(localStorage.getItem("auth"));
  const nav = useNavigate();
  const dispatch = useDispatch();
  const initialState = {
    province: val.province,
    city: val.city,
    pos: val.pos,
    labelAlamat: val.labelAlamat,
    namaPenerima: val.namaPenerima,
    no_Handphone: val.no_Handphone,
    alamatLengkap: val.alamatLengkap,
  };
  const [
    {
      province,
      city,
      pos,
      labelAlamat,
      namaPenerima,
      no_Handphone,
      alamatLengkap,
    },
    setState,
  ] = useState(initialState);
  async function changeMain() {
    try {
      console.log("sad");
      await api
        .patch("address/v3/" + val.id + "?token=" + token, {
          UserId: val.userSelector.id,
        })
        .then((res) => {
          Swal.fire("Good job!", "Main Address Changed", "success");
          val.setSelectIsMain(false);
          val.fetchUserAddresses();
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Login session has expired",
          });
          dispatch({
            type: "logout",
          });
          nav("/login");
        });
    } catch (err) {
      alert(err.data.response.message);
    }
  }
  async function deleteAddress() {
    try {
      await api
        .post("address/v4/" + val.id + "?token=" + token, {
          UserId: val.userSelector.id,
        })
        .then((res) => {
          modalEditAddress.onClose();
          formikAddress.resetForm();
          val.fetchUserAddresses();
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Login session has expired",
          });
          dispatch({
            type: "logout",
          });
          nav("/login");
        });
    } catch (err) {
      alert(err.response.data.message);
    }
  }
  async function fetchCity() {
    setPosCodes([]);
    setCities([]);
    await api.get("/city/v1/" + provinceId).then((res) => {
      setCities(res.data.result);
    });
  }
  async function fetchPos() {
    setPosCodes([]);
    await api.get("/city/v2/" + cityId).then((res) => {
      setPosCodes(res.data.result);
    });
  }
  useEffect(() => {
    const fetchData = async () => {
      const data = await api.get("province").then((res) => {
        setProvinces(res.data.result);
      });
    };
    fetchData();
  }, []);
  const formikAddress = useFormik({
    enableReinitialize: true,
    initialValues: {
      no_Handphone: val.no_Handphone,
      namaPenerima: val.namaPenerima,
      labelAlamat: val.labelAlamat,
      province: val.province,
      city: val.city,
      pos: val.pos,
      alamatLengkap: val.alamatLengkap,
    },
    validationSchema: Yup.object().shape({
      no_Handphone: Yup.string()
        .trim()
        .matches(val.phoneRegExp, "Phone number is not valid")
        .required("You need to enter a phone number"),
      namaPenerima: Yup.string()
        .required("You need to enter a receiver's name")
        .trim(),
      labelAlamat: Yup.string()
        .required("You need to enter your address labels")
        .trim(),
      province: Yup.string().trim().required("You need to enter your province"),
      city: Yup.string().trim().required("You need to enter your city"),
      pos: Yup.string().trim().required("You need to enter your poscode"),
      alamatLengkap: Yup.string()
        .trim()
        .required("You need to enter your complete address"),
    }),
    onSubmit: async () => {
      const {
        no_Handphone,
        namaPenerima,
        labelAlamat,
        province,
        city,
        pos,
        alamatLengkap,
      } = formikAddress.values;
      const address2 = {
        no_Handphone,
        namaPenerima,
        labelAlamat,
        province,
        city,
        pos,
        alamatLengkap,
        UserId: val.userSelector.id,
      };
      await api
        .patch("/address/v2/" + val.id + "?token=" + token, address2)
        .then(async (res) => {
          modalEditAddress.onClose();
          formikAddress.resetForm();
          val.fetchUserAddresses();
          Swal.fire("Good job!", "Main Address Changed", "success");
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Login session has expired",
          });
          dispatch({
            type: "logout",
          });
          nav("/login");
        });
    },
  });
  async function inputHandlerAddress(input) {
    const { value, id } = input.target;
    const tempobject = {};
    tempobject[id] = value.split("#")[0];
    setState((prevState) => ({ ...prevState, [id]: value }));
    console.log(tempobject);
    if (id == "province") {
      setProvinceId(value.split("#")[0]);
      formikAddress.setFieldValue(id, value.split("#")[1]);
    } else if (id == "city") {
      setCityId(value.split("#")[0]);
      formikAddress.setFieldValue(id, value.split("#")[1]);
    } else formikAddress.setFieldValue(id, value);
  }
  useEffect(() => {
    fetchCity();
  }, [formikAddress.values.province]);
  useEffect(() => {
    fetchPos();
  }, [formikAddress.values.city]);
  const modalEditAddress = useDisclosure();
  return (
    <>
      <Flex
        bg={"#f5f5f5"}
        w={"100%"}
        flexDir={"column"}
        border={val.selectIsMain ? "2px solid #385898" : ""}
        onClick={
          val.selectIsMain
            ? () => changeMain()
            : () => modalEditAddress.onOpen()
        }
        _hover={{ bgColor: "#c7c7c7" }}
        cursor={"pointer"}
      >
        <Flex px={"20px"} pt={"10px"} alignItems={"center"} gap={"10px"}>
          <Flex fontWeight={"700"} color={"#385898"}>
            {val.labelAlamat}
          </Flex>
          {val.isMain ? (
            <Box border={"#385898 solid 1px"} fontSize={"0.6rem"} px={"5px"}>
              Main
            </Box>
          ) : (
            <></>
          )}
        </Flex>
        <Flex p={"20px"} flexDir={"column"}>
          <Flex fontWeight={600}>{"Nama : " + val.namaPenerima}</Flex>
          <Flex>{"Poscode : " + val.pos}</Flex>
          <Flex>{val.city + " - " + val.province}</Flex>
          <Flex>{"No. Telp : " + val.no_Handphone}</Flex>
        </Flex>
        <Modal
          closeOnOverlayClick={false}
          scrollBehavior="inside"
          isOpen={modalEditAddress.isOpen}
          onClose={modalEditAddress.onClose}
          isCentered
        >
          <ModalOverlay />
          <ModalContent maxH="500px" h={"500px"} maxW="500px">
            <ModalHeader
              bgColor={"#385898"}
              color={"white"}
              px={"10px"}
              display={"flex"}
              flexDir={"row"}
              justifyContent={"center"}
            >
              <Center
                onClick={() => {
                  console.log(val.id);
                  console.log(formikAddress.values);
                }}
                fontWeight={700}
              >
                Edit Address
              </Center>
              <Flex w={"70%"} flexDir={"row-reverse"}>
                <Button
                  w={"30px"}
                  onClick={() => {
                    modalEditAddress.onClose();
                    setState({ ...initialState });
                    formikAddress.resetForm();
                  }}
                >
                  <Icon fontSize={"30px"} as={MdClose}></Icon>
                </Button>
              </Flex>
            </ModalHeader>
            <ModalBody maxH="500px" h={"500px"} maxW="500px">
              <ModalEditAddress
                id={val.id}
                alamatLengkap={alamatLengkap}
                no_Handphone={no_Handphone}
                labelAlamat={labelAlamat}
                deleteAddress={deleteAddress}
                namaPenerima={namaPenerima}
                pos={pos}
                posCodes={posCodes}
                city={city}
                province={province}
                cities={cities}
                provinces={provinces}
                formikAddress={formikAddress}
                inputHandlerAddress={inputHandlerAddress}
              ></ModalEditAddress>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
}
