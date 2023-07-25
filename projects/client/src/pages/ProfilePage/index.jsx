import {
  Avatar,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  keyframes,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";

import { motion } from "framer-motion";
import { faker } from "@faker-js/faker";
import Navbar from "../../components/Navbar";
import ProfileSidebar from "../../components/ProfileSidebar";
import { api } from "../../api/api";
import YupPassword from "yup-password";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Radio, RadioGroup } from "@chakra-ui/react";
import ModalChangePassword from "../../components/ModalChangePassword";
import { useFormik } from "formik";
import { useRef } from "react";

import ModalAddAddress from "../../components/ModalAddAddress";
import axios from "axios";
import { GoVerified } from "react-icons/go";
import ModalEditAddress from "../../components/ModalEditAddress";
export default function ProfilePage() {
  const modalChangePassword = useDisclosure();
  const modalAddAddress = useDisclosure();

  const userSelector = useSelector((state) => state.login.auth);
  const [tab, setTab] = useState("biodata");
  const [gender, setGender] = useState(userSelector.gender);
  const [phone, setPhone] = useState(userSelector.phone);
  const [last_name, setLast_name] = useState(userSelector.last_name);
  const [first_name, setFirst_name] = useState(userSelector.first_name);
  const [changes, setChanges] = useState({});
  const dispatch = useDispatch();
  const toast = useToast();
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  YupPassword(Yup);
  const [province, setProvince] = useState();
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [pos, setPos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [provinceId, setProvinceId] = useState();
  const [cityId, setCityId] = useState();
  const [addressId, setAddressId] = useState();

  const inputFileRef = useRef(null);

  const handleFile = async (event) => {
    setSelectedFile(event.target.files[0]);

    uploadAvatar(event.target.files[0], userSelector.id);
  };
  async function uploadAvatar(file, id) {
    try {
      console.log(file);
      console.log(id);
      let user;
      const formData = new FormData();
      formData.append("avatar", file);
      user = await axios
        .post(
          "http://localhost:2000/auth/image/v1/" + userSelector.id,
          formData
        )
        .then((res) => {
          console.log(res.data);
          return res.data;
        });
      // const token = JSON.parse(localStorage.getItem("auth"));
      // user = await api
      //   .get("/auth/v3?token=" + token)
      //   .then(async (res) => {
      //     return res.data;
      //   })
      //   .catch((err) => {
      //     return err.message;
      //   });
      await dispatch({
        type: "login",
        payload: user,
      });
      await console.log(user);

      toast({
        title: "Image has been added",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: false,
      });
      console.log(user);

      setSelectedFile(null);
    } catch (err) {
      setSelectedFile(null);
    }
  }
  async function fetchCity() {
    console.log(provinceId);

    await axios
      .post(
        "http://localhost:2000/address/city",
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
    await axios
      .post(
        "http://localhost:2000/address/pos",
        { id: cityId },
        {
          headers: { key: "fdaa10aca9ee40feab355d1646c531eb" },
        }
      )
      .then((res) => {
        setPos(res.data);
      });
  }
  async function fetchUserAddresses() {
    try {
      await api
        .get("/address/user/" + userSelector.id)
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
      const data = await axios
        .get("http://localhost:2000/address/province", {
          headers: { key: "fdaa10aca9ee40feab355d1646c531eb" },
        })
        .then((res) => {
          setProvinces(res.data);
        });
    };
    // call the function
    fetchData();
    fetchUserAddresses();
    // make sure to catch any error
    // .catch(console.error);
  }, []);

  const formik = useFormik({
    initialValues: {
      id: userSelector.id,
    },
    validationSchema: Yup.object().shape({
      phone: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .trim(),
    }),
    onSubmit: async () => {
      const { id, first_name, last_name, gender, phone } = formik.values;
      const account = {
        id,
        first_name,
        last_name,
        gender,
        phone: phone ? "0" + phone : undefined,
      };
      await api
        .patch("/auth/update", account)
        .then(async (res) => {
          const token = JSON.parse(localStorage.getItem("auth"));
          const user = await api.get("/auth/v3?token=" + token).then((res) => {
            return res.data;
          });
          console.log(user);
          if (user?.email) {
            dispatch({
              type: "login",
              payload: user,
            });
          }
          toast({
            title: res.data.message,
            description: "Login Successful.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((err) => {
          console.log(err);
          toast({
            position: "top",
            title: "Login ERROR",
            description: err.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    },
  });
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
        UserId: userSelector.id,
      };
      if (id) {
        await api
          .patch("/address/v2/" + id, address2)
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
      } else {
        await api
          .post("/address/v1", address2)
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
      }
    },
  });
  function radioInputHandler(value) {
    const id = "gender";
    console.log(value);
    console.log(formik.values);
    formik.setFieldValue(id, value);
  }
  function inputHandler(input) {
    const { value, id } = input.target;
    const tempobject = { ...changes };
    tempobject[id] = value;
    setChanges(tempobject);
    console.log(tempobject);
    formik.setFieldValue(id, value);
    console.log(formik.values);
  }
  async function inputHandlerAddress(input) {
    const { value, id } = input.target;

    async function lol() {
      console.log(value);
      console.log(id);
      const tempobject = {};
      tempobject[id] = value.split("#")[0];
      console.log(tempobject);
      if (id == "province") {
        setProvinceId(value.split("#")[0]);
        formikAddress.setFieldValue(id, value.split("#")[1]);
      } else if (id == "city") {
        console.log("safjas");
        setCityId(value.split("#")[0]);
        formikAddress.setFieldValue(id, value.split("#")[1]);
      } else formikAddress.setFieldValue(id, value);
    }
    await lol();

    return "lol";
  }
  useEffect(() => {
    fetchCity();
    console.log(formikAddress.values.province);
  }, [formikAddress.values.province]);
  useEffect(() => {
    fetchPos();
    console.log(formikAddress.values);
  }, [formikAddress.values.city]);
  async function verify() {
    await api
      .get("auth/generate-token/emailverify", {
        params: {
          email: userSelector.email,
        },
      })
      .then(
        (res) => alert(res.data.message)
        // /forgot-password/token
        //    console.log(res.data));
      );
  }
  return (
    <>
      <Flex flexDir={"column"}>
        <Navbar />
        <Flex gap={"40px"}>
          <ProfileSidebar />
          <Flex flexDir={"column"} gap={"20px"}>
            <Flex
              mt={"80px"}
              h={"48px"}
              borderBottom={"1px #e0e0e0 solid"}
              pr={"300px"}
            >
              <Flex>
                <Center
                  py={"10px"}
                  px={"50px"}
                  cursor={"pointer"}
                  as={motion.div}
                  borderBottom={
                    tab == "biodata" ? "2px red solid" : "1px black solid"
                  }
                  fontWeight={"500"}
                  onClick={() => {
                    setTab("biodata");
                  }}
                >
                  Biodata
                </Center>
              </Flex>
              <Flex>
                <Center
                  cursor={"pointer"}
                  fontWeight={"500"}
                  py={"10px"}
                  px={"50px"}
                  borderBottom={
                    tab == "daftarAlamat" ? "2px red solid" : "1px black solid"
                  }
                  onClick={() => {
                    setTab("daftarAlamat");
                    console.log(userAddresses);
                  }}
                >
                  Daftar Alamat
                </Center>
              </Flex>
              <Flex>
                <Center
                  cursor={"pointer"}
                  fontWeight={"500"}
                  py={"10px"}
                  px={"50px"}
                  borderBottom={
                    tab == "pembayaran" ? "2px red solid" : "1px black solid"
                  }
                  onClick={() => {
                    setTab("pembayaran");
                  }}
                >
                  Pembayaran
                </Center>
              </Flex>
            </Flex>
            {tab == "biodata" ? (
              <Flex flexDir={"column"} w={"100%"} gap={"30px"}>
                <Flex flexDir={"column"} gap={"10px"}>
                  <Flex
                    color={"grey"}
                    fontSize={"0.8rem"}
                    onClick={() => {
                      formikAddress.setFieldValue("lol", "09");
                      console.log(formikAddress.values);
                    }}
                  >
                    Profile Picture
                  </Flex>
                  <Input
                    type="file"
                    accept="image/png, image/jpeg"
                    id="file"
                    ref={inputFileRef}
                    onChange={handleFile}
                    display={"none"}
                  ></Input>
                  <Flex alignItems={"center"} gap={"20px"}>
                    <Image
                      w={"50px"}
                      h="50px"
                      borderRadius="full"
                      objectFit={"fill"}
                      src={userSelector.avatar_url}
                      onClick={() => inputFileRef.current.click()}
                    ></Image>
                    <Flex fontSize={"1.2rem"} fontWeight={600}>
                      {userSelector.first_name + " " + userSelector.last_name}
                    </Flex>
                  </Flex>
                </Flex>
                <Flex flexDir={"column"}>
                  <Flex color={"grey"} fontSize={"0.8rem"}>
                    First Name
                  </Flex>
                  <Input
                    onChange={(val) => {
                      inputHandler(val);
                      setFirst_name(val.target.value);
                    }}
                    w={"260px"}
                    id="first_name"
                    variant={"flushed"}
                    borderColor="black.800"
                    value={first_name}
                  ></Input>
                </Flex>
                <Flex flexDir={"column"}>
                  <Flex color={"grey"} fontSize={"0.8rem"}>
                    Last Name
                  </Flex>
                  <Input
                    id="last_name"
                    onChange={(val) => {
                      inputHandler(val);
                      setLast_name(val.target.value);
                    }}
                    w={"260px"}
                    variant={"flushed"}
                    borderColor="black.800"
                    placeholder={userSelector.last_name}
                    value={last_name}
                  ></Input>
                </Flex>
                <Flex flexDir={"column"}>
                  <Flex color={"grey"} fontSize={"0.8rem"}>
                    Email
                  </Flex>
                  <Flex w={"260px"} pb={"10px"} borderBottom="1px solid black">
                    {userSelector.email}
                  </Flex>
                  <Flex
                    mt={"10px"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    color={"red"}
                  >
                    <Flex cursor={"pointer"} onClick={verify}>
                      Verifikasi Email Saya
                    </Flex>
                  </Flex>
                </Flex>

                <Flex flexDir={"column"}>
                  <Flex color={"grey"} fontSize={"0.8rem"}>
                    Jenis Kelamin
                  </Flex>
                  <RadioGroup
                    id="gender"
                    onChange={(val) => {
                      setGender(val);
                      radioInputHandler(val);
                    }}
                    value={gender}
                  >
                    <Stack direction="row" gap={"20px"}>
                      <Radio size={"lg"} value="Male">
                        Laki-Laki
                      </Radio>
                      <Radio size={"lg"} value="Female">
                        Perempuan
                      </Radio>
                      <Radio size={"lg"} value="Secret">
                        Rahasia
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Flex>
                <Flex flexDir={"column"}>
                  <Flex color={"grey"} fontSize={"0.8rem"}>
                    No. Telp
                  </Flex>
                  <InputGroup w={"260px"} variant={"flushed"} gap={"10px"}>
                    <InputLeftAddon children="+62" />
                    <Input
                      focu
                      id="phone"
                      onChange={(val) => {
                        inputHandler(val);
                        setPhone(val.target.value);
                      }}
                      type="tel"
                      value={phone}
                    />
                  </InputGroup>
                  <Flex color={"red"}>{formik.errors.phone}</Flex>
                </Flex>
                <Flex flexDir={"column"}>
                  <Flex color={"grey"} fontSize={"0.8rem"}>
                    Profesi atau pekerjaan
                  </Flex>
                  <Flex>
                    <Select w={"260px"} variant="flushed" placeholder="Flushed">
                      <option value="option1">{faker.person.jobTitle()}</option>
                      <option value="option2">{faker.person.jobTitle()}</option>
                      <option value="option3">{faker.person.jobTitle()}</option>
                      <option value="option1">{faker.person.jobTitle()}</option>
                      <option value="option2">{faker.person.jobTitle()}</option>
                      <option value="option3">{faker.person.jobTitle()}</option>
                    </Select>
                  </Flex>
                </Flex>
                <Flex>
                  <Button onClick={formik.handleSubmit}>Save</Button>
                </Flex>
                <Flex h={"1px"} bgColor={"#e0e0e0"} w={"100%"}></Flex>
                <Button
                  fontWeight={"600"}
                  fontSize={"1rem"}
                  color={"black"}
                  mb={"40px"}
                  w={"200px"}
                  onClick={() => {
                    console.log("yes");
                    modalChangePassword.onOpen();
                  }}
                >
                  Change Password
                </Button>
                <Modal
                  isOpen={modalChangePassword.isOpen}
                  onClose={modalChangePassword.onClose}
                  isCentered
                >
                  <ModalOverlay />
                  <ModalContent maxH="500px" h={"500px"} maxW="400px">
                    <ModalChangePassword
                      onClose={modalChangePassword.onClose}
                    />
                  </ModalContent>
                </Modal>
              </Flex>
            ) : tab == "daftarAlamat" ? (
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
                    <EditAddress
                      fetchUserAddresses={fetchUserAddresses}
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
                  <ModalContent maxH="500px" h={"500px"} maxW="500px">
                    <ModalHeader
                      px={"10px"}
                      display={"flex"}
                      flexDir={"row"}
                      justifyContent={"center"}
                    >
                      <Center fontWeight={700}>Add Address</Center>
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

                    <ModalBody maxH="500px" h={"500px"} maxW="500px">
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
            ) : (
              <Flex>djas</Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
function EditAddress(val) {
  const modalAddAddress = useDisclosure();

  const userSelector = useSelector((state) => state.login.auth);

  const toast = useToast();
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  YupPassword(Yup);
  // const [province, setProvince] = useState(val.province);
  const [provinces, setProvinces] = useState([]);
  // const [city, setCity] = useState(val.city);
  const [cities, setCities] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [posCodes, setPosCodes] = useState([]);

  // const [pos, setPos] = useState(val.pos);
  // const [isMain, setIsMain] = useState();
  // const [labelAlamat, setLabelAlamat] = useState(val.labelAlamat);
  // const [namaPenerima, setNamaPenerima] = useState(val.namaPenerima);
  // const [no_Handphone, setNo_Handphone] = useState(val.no_Handphone);
  // const [alamatLengkap, setAlamatLengkap] = useState(val.alamatLengkap);
  const [provinceId, setProvinceId] = useState();
  const [cityId, setCityId] = useState();
  const [addressId, setAddressId] = useState();
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
      await axios
        .delete("http://localhost:2000/address/v3/" + val.id)
        .then((res) => {
          modalEditAddress.onClose();
          formikAddress.resetForm();
          val.fetchUserAddresses();
        });
    } catch (err) {
      alert(err.data.message);
    }
  }
  async function fetchCity() {
    console.log(provinceId);

    await axios
      .post(
        "http://localhost:2000/address/city",
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
    await axios
      .post(
        "http://localhost:2000/address/pos",
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
        .get("/address/user/" + userSelector.id)
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
      const data = await axios
        .get("http://localhost:2000/address/province", {
          headers: { key: "fdaa10aca9ee40feab355d1646c531eb" },
        })
        .then((res) => {
          setProvinces(res.data);
        });
    };
    // call the function
    fetchData();
    fetchUserAddresses();
    // make sure to catch any error
    // .catch(console.error);
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
        UserId: userSelector.id,
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

    return "lol";
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
              // setAlamatLengkap={setAlamatLengkap}
              no_Handphone={no_Handphone}
              // setNo_Handphone={setNo_Handphone}
              labelAlamat={labelAlamat}
              // setLabelAlamat={setLabelAlamat}
              // setNamaPenerima={setNamaPenerima}
              deleteAddress={deleteAddress}
              namaPenerima={namaPenerima}
              pos={pos}
              posCodes={posCodes}
              // setPos={setPos}
              city={city}
              // setCity={setCity}
              // setProvince={setProvince}
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
  );
}
