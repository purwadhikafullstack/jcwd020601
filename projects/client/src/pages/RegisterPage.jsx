import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import logo from "../assets/images/gramedia-icon-2.png";
import jwt_decode from "jwt-decode";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { Formik, useFormik } from "formik";
import { BsApple, BsFacebook, BsGift, BsGoogle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { TbAlertCircleFilled } from "react-icons/tb";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";

export default function RegisterPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    /*global google*/

    google.accounts.id.initialize({
      client_id:
        "417414378341-aaj9jcihblf9ek3mo6kh86cq5rmc7ebs.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "medium",
      width: 300,
    });
    google.accounts.id.prompt();
  }, []);

  async function handleCallbackResponse(response) {
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    try {
      let token;
      const loggingIn = await api()
        .post("/auth/v3", userObject)
        .then((res) => {
          localStorage.setItem("auth", JSON.stringify(res.data.token));
          token = res.data.token;
          toast({
            title: res.data.message,
            description: "Login Successful.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          return res.data.message;
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
      console.log(loggingIn);
      if (loggingIn) {
        await api()
          .get("/auth/v3?token=" + token)
          .then((res) => {
            console.log(res.data);
            dispatch({
              type: "login",
              payload: res.data,
            });
          });
        nav("/");
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
    // document.getElementById("signInDiv").hidden = true;
  }
  YupPassword(Yup);
  const [seepassword, setSeePassword] = useState(false);
  const [seepassword2, setSeePassword2] = useState(false);

  const toast = useToast();
  const [radioValue, setRadioValue] = useState("Male");
  const nav = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password2: "",
      password: "",
      username: "",
      first_name: "",
      last_name: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("You need to enter your email")
        .email("Email is not valid"),
      first_name: Yup.string()
        .required("You need to enter your first name")
        .trim(),
      last_name: Yup.string()
        .required("You need to enter your last name")
        .trim(),
      password2: Yup.string()
        .required("You need to confirm your password")
        .trim()
        .oneOf([Yup.ref("password")], "Passwords don't match"),
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

      username: Yup.string().required("You need to enter your username").trim(),
    }),
    onSubmit: async () => {
      const { email, password, username, first_name, last_name } =
        formik.values;
      const account = { email, password, username, first_name, last_name };

      const checkemail = await api()
        .get("/auth/email?email=" + email)
        .then((res) => {
          if (res.data) {
            return true;
          } else {
            return false;
          }
        });
      console.log(checkemail);
      if (checkemail) {
        alert("Email has been used");
        formik.values.email = "";
      } else {
        await api()
          .post("/auth", account)
          .then(() => {
            toast({
              title: "Account created.",
              description: "We've created your account for you.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            nav("/login");
          })
          .catch((err) => {
            alert(err.response.data.message);
          });
      }
    },
  });
  const [register, setRegister] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  function inputHandler(input) {
    const { value, id } = input.target;
    const tempobject = { ...register };
    tempobject[id] = value;
    setRegister(tempobject);
    formik.setFieldValue(id, value);
  }
  return (
    <>
      <Center flexDir={"column"} gap={"10px"} pt={"10px"}>
        <Center flexDir={"column"} gap={"80px"}>
          <Center flexDir={"column"}>
            <Center minW={"700px"} w={"700px"} gap={"12px"} flexDir={"column"}>
              <Center
                minW={"500px"}
                w={"500px"}
                flexDir={"column"}
                border={"1px solid #dbdbdb"}
              >
                <Img src={logo} width={"300px"} className="register-logo"></Img>
                <Center
                  maxW={"300px"}
                  fontSize={"18px"}
                  color={"blackAlpha.700"}
                  textAlign={"center"}
                  fontWeight={"500"}
                  pb={"10px"}
                >
                  Sign up to buy books from Gramedia
                </Center>

                <Center gap={"10px"} flexDir={"column"} pt={"10px"} w={"300px"}>
                  <Input
                    maxLength={32}
                    w={"300px"}
                    fontSize={"12px"}
                    bgColor={"#fafafa"}
                    placeholder="Email or Phone Number"
                    pl={"7px"}
                    id="email"
                    onChange={inputHandler}
                  ></Input>

                  <Flex w={"100%"} fontSize={"12px"} color={"red"}>
                    {formik.errors.email}
                  </Flex>
                  <Input
                    maxLength={32}
                    w={"300px"}
                    fontSize={"12px"}
                    bgColor={"#fafafa"}
                    placeholder="First name"
                    pl={"7px"}
                    id="first_name"
                    onChange={inputHandler}
                  ></Input>
                  <Flex w={"100%"} fontSize={"12px"} color={"red"}>
                    {formik.errors.first_name}
                  </Flex>
                  <Input
                    maxLength={32}
                    w={"300px"}
                    fontSize={"12px"}
                    bgColor={"#fafafa"}
                    placeholder="Last name"
                    pl={"7px"}
                    id="last_name"
                    onChange={inputHandler}
                  ></Input>
                  <Flex w={"100%"} fontSize={"12px"} color={"red"}>
                    {formik.errors.last_name}
                  </Flex>
                  <Input
                    maxLength={32}
                    w={"300px"}
                    fontSize={"12px"}
                    bgColor={"#fafafa"}
                    placeholder="Username"
                    pl={"7px"}
                    id="username"
                    onChange={inputHandler}
                  ></Input>
                  <Flex w={"100%"} fontSize={"12px"} color={"red"}>
                    {formik.errors.username}
                  </Flex>
                  <InputGroup>
                    <Input
                      pl={"7px"}
                      id="password"
                      maxLength={32}
                      onChange={inputHandler}
                      bgColor={"#fafafa"}
                      fontSize={"12px"}
                      type={seepassword2 ? "text" : "password"}
                      placeholder="Create your password"
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
                  <Flex w={"300px"} fontSize={"12px"} color={"red"}>
                    {formik.errors.password}
                  </Flex>
                  <InputGroup>
                    <Input
                      pl={"7px"}
                      maxLength={32}
                      fontSize={"12px"}
                      bgColor={"#fafafa"}
                      id="password2"
                      onChange={inputHandler}
                      type={seepassword ? "text" : "password"}
                      placeholder="Confirm your password"
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
                  <Center gap={"10px"}>
                    <Flex
                      h={"2px"}
                      w={"130px"}
                      bgColor={"blackAlpha.300"}
                    ></Flex>
                    <Flex>OR</Flex>
                    <Flex
                      h={"2px"}
                      w={"130px"}
                      bgColor={"blackAlpha.300"}
                    ></Flex>
                  </Center>
                  <div id="signInDiv"></div>
                  <Flex w={"100%"} fontSize={"12px"} color={"red"}>
                    {formik.errors.password2}
                  </Flex>
                  <Center textAlign={"center"} fontSize={"12px"} maxW={"300px"}>
                    <Flex>
                      <span>
                        People who use our service may have uploaded your
                        contact information to our offical Instagram.
                        {/* <Flex> Learn More</Flex> */}
                        <a
                          href="http://instagram.com"
                          style={{ color: "#0bc5ea" }}
                        >
                          <span>Learn More</span>
                        </a>
                      </span>
                    </Flex>
                  </Center>
                  <Center textAlign={"center"} fontSize={"12px"} maxW={"300px"}>
                    <span>
                      {" "}
                      By signing up, you agree to our{" "}
                      <a style={{ color: "#0bc5ea", cursor: "pointer" }}>
                        Terms,{" "}
                      </a>
                      <a style={{ color: "#0bc5ea", cursor: "pointer" }}>
                        Privacy Policy
                      </a>
                      <span> and </span>
                      <a style={{ color: "#0bc5ea", cursor: "pointer" }}>
                        Cookies Policy
                      </a>{" "}
                    </span>
                  </Center>
                  <Flex w={"100%"}>
                    <Button
                      color={"white"}
                      borderRadius={"10px"}
                      w={"100%"}
                      colorScheme="facebook"
                      onClick={formik.handleSubmit}
                    >
                      Sign Up
                    </Button>
                  </Flex>

                  <Flex pb={"15px"} fontSize={"12px"}>
                    <span>
                      Already Registered?&nbsp;
                      <a
                        style={{
                          color: "#0bc5ea",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          nav("/login");
                        }}
                      >
                        Login{" "}
                      </a>
                    </span>
                  </Flex>
                </Center>
              </Center>

              {/* <Flex gap={"10px"}>
                <Img
                  cursor={"pointer"}
                  src={logo2}
                  width={"130px"}
                  h={"40px"}
                ></Img>
                <Img
                  cursor={"pointer"}
                  src={logo3}
                  width={"130px"}
                  h={"40px"}
                ></Img>
              </Flex> */}
            </Center>
          </Center>
          <Center flexWrap={"wrap"} color={"blackAlpha.700"} gap={"16px"}>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              Meta
            </Flex>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              About
            </Flex>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              Blog
            </Flex>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              Jobs
            </Flex>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              Help
            </Flex>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              API
            </Flex>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              Privacy
            </Flex>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              Terms
            </Flex>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              Top Accounts
            </Flex>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              Locations
            </Flex>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              Gramedia Lite
            </Flex>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              Contact Uploading & Non-Users
            </Flex>
            <Flex fontSize={"13px"} cursor={"pointer"}>
              Meta Verified
            </Flex>
          </Center>
        </Center>
        <Center color={"blackAlpha.700"} gap={"20px"}>
          <Flex fontSize={"13px"}> English</Flex>
          <Flex fontSize={"13px"}> © 2023 Gramedia from Meta</Flex>
        </Center>
      </Center>
    </>
  );
}
