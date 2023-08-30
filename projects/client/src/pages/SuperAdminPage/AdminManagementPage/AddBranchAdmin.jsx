import {
  Button,
  Center,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import YupPassword from "yup-password";

import ModalAddAdmin from "../../../components/ModalAddAdmin.jsx";
import { MdClose } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "../../../api/api.js";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function AddAdminButton(props) {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const userSelector = useSelector((state) => state.login.auth);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [provinceId, setProvinceId] = useState();
  const [cityId, setCityId] = useState();
  const [pos, setPos] = useState([]);

  const toast = useToast();
  YupPassword(Yup);
  async function inputHandlerAddress(input) {
    const { value, id } = input.target;
    console.log(value);
    console.log(id);
    const tempobject = {};
    tempobject[id] = value;
    console.log(tempobject);
    formikAddress.setFieldValue(id, value);
    if (id == "province") {
      setProvinceId(value.split("#")[0]);
      formikAddress.setFieldValue(id, value.split("#")[1]);
    } else if (id == "city") {
      console.log("safjas");
      setCityId(value.split("#")[0]);
      formikAddress.setFieldValue(id, value.split("#")[1]);
    } else formikAddress.setFieldValue(id, value);
  }
  const formikAddress = useFormik({
    initialValues: {},
    validationSchema: Yup.object().shape({
      phone: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .trim()
        .required("You need to enter a phone number"),
      email: Yup.string()
        .required("You need to enter the admin's email")
        .email("This is not a valid email"),
      name: Yup.string().required("You need to enter the admin's name").trim(),
      password: Yup.string()
        .required("You need to enter your password")
        .minUppercase(
          1,
          "Your password needs atleast 1 uppercase letter, 1 number, and 1 symbol with atleast 8 characters"
        )
        .minNumbers(
          1,
          "Your password needs atleast 1 uppercase letter, 1 number, and 1 symbol with atleast 8 characters"
        )
        .minSymbols(
          1,
          "Your password needs atleast 1 uppercase letter, 1 number, and 1 symbol with atleast 8 characters"
        )
        .min(
          8,
          "Your password needs atleast 1 uppercase letter, 1 number, and 1 symbol with atleast 8 characters"
        )
        .trim(),
      branchName: Yup.string()
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
        name,
        email,
        password,
        phone,
        branchName,
        province,
        city,
        pos,
        alamatLengkap,
      } = formikAddress.values;
      const data = {
        name,
        email,
        password,
        phone,
        branchName,
        province,
        city,
        pos,
        alamatLengkap,
      };
      await api()
        .post("/admin/v4", data)
        .then(async (res) => {
          // modalAddAdmin.onClose();
          // formikAddress.resetForm();
          toast({
            position: "top",
            title: res.data.message,
            description: "Succesfully Added.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          props.getAllAdminBranch();
        })
        .catch((err) => {
          console.log(err);
          toast({
            position: "top",
            title: "Something went wrong",
            description: err.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    },
  });

  useEffect(() => {
    fetchCity();
    console.log(formikAddress.values.province);
  }, [formikAddress.values.province]);
  useEffect(() => {
    fetchPos();
    console.log(formikAddress.values);
  }, [formikAddress.values.city]);

  async function fetchCity() {
    setPos();
    setCities([]);
    await api()
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
    await api()
      .get("/city/v2/" + cityId)
      .then((res) => {
        setPos(res.data.result);
      });
  }

  const modalAddAdmin = useDisclosure();
  return (
    <>
      <Flex>
        <Button
          color={"white"}
          bgColor={"#2c5282"}
          onClick={() => {
            modalAddAdmin.onOpen();
          }}
        >
          Add Branch-Admin and New Branch
        </Button>
      </Flex>
      <Modal
        closeOnOverlayClick={false}
        scrollBehavior="inside"
        isOpen={modalAddAdmin.isOpen}
        onClose={modalAddAdmin.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent maxH="500px" h={"500px"} maxW="500px">
          <ModalHeader
            px={"10px"}
            display={"flex"}
            flexDir={"row"}
            justifyContent={"center"}
          >
            <Center w={"100%"} fontWeight={700} fontSize={"1rem"}>
              Add Branch-Admin and New Branch
            </Center>
            <Flex w={"70%"} flexDir={"row-reverse"}>
              <Button
                w={"30px"}
                onClick={() => {
                  modalAddAdmin.onClose();
                  formikAddress.resetForm();
                }}
              >
                <Icon fontSize={"30px"} as={MdClose}></Icon>
              </Button>
            </Flex>
          </ModalHeader>

          <ModalBody maxH="500px" h={"500px"} maxW="500px">
            <ModalAddAdmin
              formikAddress={formikAddress}
              pos={pos}
              setPos={setPos}
              setCities={setCities}
              cities={cities}
              setProvinces={setProvinces}
              provinces={provinces}
              inputHandlerAddress={inputHandlerAddress}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
