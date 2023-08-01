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
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import * as Yup from "yup";
import { MdClose } from "react-icons/md";
import { GoVerified } from "react-icons/go";
import YupPassword from "yup-password";
import ModalEditAddress from "./ModalEditAddress";

export default function EditAddress(val) {
  const modalAddAddress = useDisclosure();
  const toast = useToast();
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  YupPassword(Yup);
  const [provinces, setProvinces] = val.useState([]);
  const [cities, setCities] = val.useState([]);
  const [userAddresses, setUserAddresses] = val.useState([]);
  const [posCodes, setPosCodes] = val.useState([]);
  const [provinceId, setProvinceId] = val.useState();
  const [cityId, setCityId] = val.useState();
  const [addressId, setAddressId] = val.useState();
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
  async function deleteAddress() {
    try {
      await api
        .post("address/v4/" + val.id, { UserId: val.userSelector.id })
        .then((res) => {
          modalEditAddress.onClose();
          formikAddress.resetForm();
          val.fetchUserAddresses();
        });
    } catch (err) {
      alert(err.data.response.message);
    }
  }
  async function fetchCity() {
    console.log(provinceId);

    await api
      .post(
        "address/city",
        { id: provinceId },
        {
          headers: { key: "fdaa10aca9ee40feab355d1646c531eb" },
        }
      )
      .then((res) => {
        setCities(res.data);
      });
  }
  async function fetchPos() {
    console.log(cityId);
    await api
      .post(
        "address/pos",
        { id: cityId },
        {
          headers: { key: "fdaa10aca9ee40feab355d1646c531eb" },
        }
      )
      .then((res) => {
        setPosCodes(res.data);
      });
  }
  async function fetchUserAddresses() {
    try {
      await api
        .get("/address/user/" + val.userSelector.id)
        .then((res) => {
          setUserAddresses(res.data);
        })
        .catch((err) => {
          toast({
            position: "top",
            title: "Something went wrong",
            description: err.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } catch (err) {
      alert(err.data.message);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const data = await api
        .get("address/province", {
          headers: { key: "fdaa10aca9ee40feab355d1646c531eb" },
        })
        .then((res) => {
          setProvinces(res.data);
        });
    };
    fetchData();
    fetchUserAddresses();
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
        .matches(phoneRegExp, "Phone number is not valid")
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
        .patch("/address/v2/" + val.id, address2)
        .then(async (res) => {
          modalEditAddress.onClose();
          formikAddress.resetForm();
          val.fetchUserAddresses();
          toast({
            position: "top",
            title: res.data.message,
            description: "Address Saved.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
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

  async function inputHandlerAddress(input) {
    const { value, id } = input.target;
    async function lol() {
      console.log(value);
      console.log(id);
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
      console.log(formikAddress.values);
    }
    await lol();
  }
  useEffect(() => {
    fetchCity();
    console.log(formikAddress.values.province);
  }, [formikAddress.values.province]);
  useEffect(() => {
    fetchPos();
    console.log(formikAddress.values);
  }, [formikAddress.values.city]);

  const modalEditAddress = useDisclosure();
  return (
    <>
      <Flex
        bg={"#f5f5f5"}
        w={"100%"}
        flexDir={"column"}
        onClick={() => {
          setAddressId(val.id);
          modalEditAddress.onOpen();
        }}
        _hover={{ bgColor: "#c7c7c7" }}
        cursor={"pointer"}
      >
        <Flex px={"20px"} pt={"10px"} alignItems={"center"} gap={"10px"}>
          <Flex fontWeight={"700"} color={"#385898"}>
            {val.labelAlamat}
          </Flex>
          {val.isMain ? <Icon as={GoVerified}></Icon> : <></>}
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
                setState={setState}
                fetchPos={fetchPos}
                cities={cities}
                setCities={setCities}
                fetchCity={fetchCity}
                setProvinces={setProvinces}
                provinces={provinces}
                formikAddress={formikAddress}
                onClose={modalAddAddress.onClose}
                inputHandlerAddress={inputHandlerAddress}
              ></ModalEditAddress>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
}
