import {
  Box,
  Center,
  Flex,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  IconButton,
  Img,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../assets/images/gramedia-icon-2.png";
import YupPassword from "yup-password";
import React from "react";
import { api } from "../api/api";

export default function ForgotPassword() {
  YupPassword(Yup);
  const location = useLocation();
  const [user, setUser] = useState({});
  const [token, setToken] = useState();
  const [seepassword, setSeePassword] = useState(false);
  const [seepassword2, setSeePassword2] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      password2: "",
    },
    validationSchema: Yup.object().shape({
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
        ),
      password2: Yup.string()
        .required("You need to confirm your password")
        .oneOf([Yup.ref("password")], "Passwords don't match"),
    }),
    onSubmit: async () => {
      const { password } = formik.values;
      const account = { password };
      changePassword(account);
    },
  });
  async function fetchUser(token) {
    await api()
      .get("auth/v3?token=" + token, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.log(err));
  }

  async function changePassword(values) {
    await api()
      .patch("auth/v4?token=" + token, {
        user: values,
      })
      .then((res) => {
        alert(res.data.message);
        nav("/login");
      })
      .catch((err) => {
        alert("Token hasdasds expired");
        console.log(err);
        // nav("/login");
      });
  }

  useEffect(() => {
    const token2 = location.pathname.split("/")[2]; // ini variable sementara untuk nampung
    fetchUser(token2);
    setToken(token2);
  }, []);

  const dispatch = useDispatch();

  const nav = useNavigate();

  const inputHandler = (e) => {
    const { id, value } = e.target;
    const tempUser = { ...user };
    tempUser[id] = value;
    setUser(tempUser);
    formik.setFieldValue(id, value);
  };

  return (
    <>
      {user.id ? (
        <Box w="100vw" h="100vh" bgColor={"#F2F4F7"}>
          <Center w="100%" h="100%">
            <Flex
              bgColor={"white"}
              w="300px"
              flexDir={"column"}
              padding="20px"
              gap="10px"
              borderRadius={"10px"}
            >
              <Box
                fontWeight={"500"}
                fontSize={"30px"}
                fontFamily={"sans-serif"}
              >
                Forgot Password
              </Box>

              <Box>
                <Box fontWeight={"500"} paddingBottom={"10px"}>
                  {" "}
                  New Password
                </Box>
                <Flex flexDir={"column"} gap={"20px"}>
                  <InputGroup>
                    <Input
                      id="password"
                      onChange={inputHandler}
                      type={seepassword ? "text" : "password"}
                      border={"1px #878787 solid"}
                      placeholder="Create your password"
                      paddingY={"8px"}
                    ></Input>
                    <InputRightElement width={"2.5rem"} h={"100%"}>
                      <IconButton
                        colorScheme="whiteAlpha"
                        color={"grey"}
                        as={seepassword ? AiOutlineEye : AiOutlineEyeInvisible}
                        w={"32px"}
                        h={"32px"}
                        onClick={() => setSeePassword(!seepassword)}
                        cursor={"pointer"}
                      ></IconButton>
                    </InputRightElement>
                  </InputGroup>
                  <InputGroup>
                    <Input
                      id="password2"
                      onChange={inputHandler}
                      type={seepassword2 ? "text" : "password"}
                      border={"1px #878787 solid"}
                      placeholder="Confirm your password"
                      paddingY={"8px"}
                    ></Input>
                    <InputRightElement width={"2.5rem"} h={"100%"}>
                      <IconButton
                        colorScheme="whiteAlpha"
                        color={"grey"}
                        as={seepassword2 ? AiOutlineEye : AiOutlineEyeInvisible}
                        w={"32px"}
                        h={"32px"}
                        onClick={() => setSeePassword2(!seepassword2)}
                        cursor={"pointer"}
                      ></IconButton>
                    </InputRightElement>
                  </InputGroup>
                </Flex>
                <Flex w={"100%"} fontSize={"12px"} color={"red"}>
                  {formik.errors.password2}
                </Flex>
              </Box>

              <Button
                marginTop={"25px"}
                bgColor="#035EBF"
                color={"white"}
                w="100%"
                onClick={formik.handleSubmit}
              >
                Change Password
              </Button>
              {/* </Link> */}
            </Flex>
          </Center>
        </Box>
      ) : (
        <Center h="100vh">
          <h1> Link has Expired </h1>
        </Center>
      )}
    </>
  );
}

export function RequestForgotPassword() {
  const toastIdRef = React.useRef();

  const toast = useToast();
  const [email, setEmail] = useState("");
  const nav = useNavigate();
  const [cooldown, setCooldown] = useState(false);
  function nothing() {}

  async function forgotPassword() {
    setCooldown(true);
    try {
      await api()
        .get("auth/generate-token/email", {
          params: {
            email,
          },
        })
        .then((res) => {
          toast({
            id: "err",
            position: "top",
            title: "Success",
            description: res.data.message,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setEmail("");
        });
    } catch (err) {
      await toast.closeAll();
      toastIdRef.current = toast({
        id: "err",
        position: "top",
        title: "Recover Password ERROR",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setTimeout(() => {
      setCooldown(false);
    }, 500);
  }
  return (
    <Box w="100vw" h="100vh">
      <Box className="forgetpassword-container">
        <Center w={"100%"} borderBottom="#949494 1px solid" py={"10px"}>
          <Img src={logo} className="forgetpassword-logo"></Img>
        </Center>
        <Flex
          flexDir={"column"}
          padding="20px"
          borderRadius={"10px"}
          className="forgetpassword-container2"
        >
          <Box className="forgetpassword-title">Request Forgot Password</Box>
          <Box className="forgetpassword-description">
            Enter your email, and we will send an email to change your password
          </Box>
          <Box>
            <Box fontWeight={"500"} paddingBottom={"10px"}>
              {" "}
              Email
            </Box>
            <Input
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></Input>
          </Box>

          <Button
            marginTop={"25px"}
            bgColor="#035EBF"
            color={"white"}
            w="100%"
            onClick={cooldown ? nothing : forgotPassword}
          >
            Send
          </Button>
          <Flex className="forgetpassword-textlink">
            Back to&nbsp;
            <Box
              className="forgetpassword-link"
              onClick={() => {
                nav("/login");
              }}
            >
              Login&nbsp;
            </Box>
            or&nbsp;
            <Box
              className="forgetpassword-link"
              onClick={() => {
                nav("/register");
              }}
            >
              Register
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
