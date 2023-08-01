import {
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import ModalChangePassword from "./ModalChangePassword";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import YupPassword from "yup-password";
import { api } from "../../api/api";
import { useDispatch } from "react-redux";
import ModalChangeProfile from "./ModalChangeProfile";
export default function Biodata(props) {
  YupPassword(Yup);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const [gender, setGender] = useState(props.userSelector.gender);
  const [phone, setPhone] = useState(props.userSelector.phone);
  const [last_name, setLast_name] = useState(props.userSelector.last_name);
  const [first_name, setFirst_name] = useState(props.userSelector.first_name);
  const [changes, setChanges] = useState({});
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();
  const modalChangePassword = useDisclosure();
  const modalChangeProfile = useDisclosure();
  const inputFileRef = useRef(null);
  const handleFile = async (event) => {
    setSelectedFile(event.target.files[0]);
    uploadAvatar(event.target.files[0], props.userSelector.id);
  };
  const formik = useFormik({
    initialValues: {
      id: props.userSelector.id,
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
  async function uploadAvatar(file, id) {
    try {
      let user;
      const formData = new FormData();
      formData.append("avatar", file);
      user = await api
        .post(
          "http://localhost:2000/auth/image/v1/" + props.userSelector.id,
          formData
        )
        .then((res) => {
          console.log(res.data);
          return res.data;
        });
      await dispatch({
        type: "login",
        payload: user,
      });
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
  async function inputHandlerPhone(input) {
    let { value, id, maxLength } = input.target;
    const tempobject = {};
    if (value[0] == 0) {
      input.target.value = value.slice(1);
    }
    if (value.length >= maxLength) {
      input.target.value = value.slice(0, maxLength);
    }
    formik.setFieldValue(id, value);
    console.log(tempobject);
    console.log(formik.values);
  }
  function radioInputHandler(value) {
    const id = "gender";
    formik.setFieldValue(id, value);
  }
  function inputHandler(input) {
    const { value, id } = input.target;
    const tempobject = { ...changes };
    tempobject[id] = value;
    setChanges(tempobject);
    formik.setFieldValue(id, value);
  }
  async function verify() {
    await api
      .get("auth/generate-token/emailverify", {
        params: {
          email: props.userSelector.email,
        },
      })
      .then((res) => alert(res.data.message));
  }
  return (
    <Flex
      flexDir={"column"}
      w={"100%"}
      gap={"30px"}
      px={{ base: "10px", sm: "0px" }}
    >
      <Flex flexDir={"column"} gap={"10px"}>
        <Flex color={"grey"} fontSize={"0.8rem"}>
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
            border={"2px #0060ae solid"}
            src={
              props.userSelector.avatar_url
                ? props.userSelector.avatar_url
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT19eLyqRHQDO-VnXj1HhzL_9q8yHF-3ewIhA&usqp=CAU"
            }
            onClick={() => inputFileRef.current.click()}
          ></Image>
          <Flex fontSize={"1.2rem"} fontWeight={600}>
            {props.userSelector.first_name + " " + props.userSelector.last_name}
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
          maxLength={32}
          borderColor="black.800"
          value={first_name}
        ></Input>
      </Flex>
      <Flex flexDir={"column"}>
        <Flex color={"grey"} fontSize={"0.8rem"}>
          Last Name
        </Flex>
        <Input
          maxLength={32}
          id="last_name"
          onChange={(val) => {
            inputHandler(val);
            setLast_name(val.target.value);
          }}
          w={"260px"}
          variant={"flushed"}
          borderColor="black.800"
          placeholder={props.userSelector.last_name}
          value={last_name}
        ></Input>
      </Flex>
      <Flex flexDir={"column"}>
        <Flex color={"grey"} fontSize={"0.8rem"}>
          Email
        </Flex>
        <Flex w={"260px"} pb={"10px"} borderBottom="1px solid black">
          {props.userSelector.email}
        </Flex>
        <Flex mt={"10px"} fontWeight={"600"} fontSize={"1rem"} color={"red"}>
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
          <Stack direction="row" gap={{ base: "10px", sm: "20px" }}>
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
            maxLength={12}
            id="phone"
            onChange={(val) => {
              inputHandlerPhone(val);
              setPhone(val.target.value);
            }}
            type="number"
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
          <Select w={"260px"} variant="flushed" placeholder="Flushed"></Select>
        </Flex>
      </Flex>
      <Flex>
        <Button onClick={() => modalChangeProfile.onOpen()}>Save</Button>
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
          <ModalChangePassword onClose={modalChangePassword.onClose} />
        </ModalContent>
      </Modal>
      <Modal
        isOpen={modalChangeProfile.isOpen}
        onClose={modalChangeProfile.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent maxH="500px" h={"200px"} maxW="400px">
          <ModalChangeProfile
            onClose={modalChangeProfile.onClose}
            formik={formik}
          />
        </ModalContent>
      </Modal>
    </Flex>
  );
}
