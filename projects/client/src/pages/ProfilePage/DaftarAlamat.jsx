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
import { api } from "../../api/api";
import { MdClose } from "react-icons/md";
import EditAddress from "./EditAddress";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function DaftarAlamat(props) {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const modalAddAddress = useDisclosure();
  const dispatch = useDispatch();
  const [provinces, setProvinces] = useState([]);
  const [province, setProvince] = useState();
  const [cities, setCities] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [pos, setPos] = useState([]);
  const [provinceId, setProvinceId] = useState();
  const [cityId, setCityId] = useState();
  const toast = useToast();
  const nav = useNavigate();

  YupPassword(Yup);
  const formikAddress = useFormik({
    initialValues: {},
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
        id,
        no_Handphone,
        namaPenerima,
        labelAlamat,
        province,
        city,
        pos,
        alamatLengkap,
      } = formikAddress.values;
      const address2 = {
        id,
        no_Handphone,
        namaPenerima,
        labelAlamat,
        province,
        city,
        pos,
        alamatLengkap,
        UserId: props.userSelector.id,
      };
      const token = JSON.parse(localStorage.getItem("auth"));
      await api
        .post("/address/v1?token=" + token, address2)
        .then(async (res) => {
          modalAddAddress.onClose();
          formikAddress.resetForm();
          fetchUserAddresses();
          toast({
            position: "top",
            title: res.data.message,
            description: "Address Added.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((err) => {
          dispatch({
            type: "logout",
          });
          modalAddAddress.onClose();
          nav("/login");
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
    if (props.userSelector.email) {
      const fetchData = async () => {
        const data = await api
          .get("/address/province", {
            headers: { key: "fdaa10aca9ee40feab355d1646c531eb" },
          })
          .then((res) => {
            setProvinces(res.data);
          });
      };
      console.log("sanfjasf");
      fetchData();
      fetchUserAddresses();
    }
  }, []);
  async function fetchUserAddresses() {
    try {
      await api.get("/address/user/" + props.userSelector.id).then((res) => {
        setUserAddresses(res.data);
      });
    } catch (err) {
      toast({
        position: "top",
        title: "Something went wrong",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }
  async function fetchCity() {
    await api
      .post(
        "/address/city",
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
    await api
      .post(
        "/address/pos",
        { id: cityId },
        {
          headers: { key: "fdaa10aca9ee40feab355d1646c531eb" },
        }
      )
      .then((res) => {
        setPos(res.data);
      });
  }

  async function inputHandlerAddress(input) {
    const { value, id } = input.target;
    const tempobject = {};
    tempobject[id] = value.split("#")[0];
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
  return (
    <Flex flexDir={"column"} gap={"20px"} pr={"50px"}>
      <Button
        w={"160px"}
        onClick={() => {
          modalAddAddress.onOpen();
        }}
        colorScheme="facebook"
      >
        Tambah Alamat
      </Button>
      {userAddresses.map((val) => {
        return (
          <>
            <EditAddress
              userSelector={props.userSelector}
              useState={useState}
              fetchUserAddresses={fetchUserAddresses}
              inputHandlerAddress={inputHandlerAddress}
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
