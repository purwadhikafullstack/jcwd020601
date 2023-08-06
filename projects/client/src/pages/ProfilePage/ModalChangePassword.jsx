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
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { api } from "../../api/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import logo from "../../assets/images/gramedia-icon-2.png";
import YupPassword from "yup-password";
import React from "react";
import Swal from "sweetalert2";

export default function ModalChangePassword(props) {
  YupPassword(Yup);
  const location = useLocation();
  const [user, setUser] = useState({});
  const [token, setToken] = useState();
  const [seepassword, setSeePassword] = useState(false);
  const [seepassword2, setSeePassword2] = useState(false);
  const [seepassword3, setSeePassword3] = useState(false);
  const userSelector = useSelector((state) => state.login.auth);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      email: userSelector.email,
      password: "",
      password2: "",
    },
    validationSchema: Yup.object().shape({
      oldPassword: Yup.string().required("You need to enter your password"),
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
      const { password, email, oldPassword } = formik.values;
      const account = { password, email, oldPassword };
      changePassword(account);
    },
  });

  async function changePassword(values) {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));

      await axios
        .patch("http://localhost:2000/auth/v5?token=" + token, {
          email: values.email,
          oldPassword: values.oldPassword,
          user: values,
        })
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
          // window.location.reload(false);
          props.onClose();
        })
        .catch((err) => {
          console.log(err);
          props.onClose();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data.message,
          });
          // nav("/login");
        });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Login session has expired",
      });
      localStorage.removeItem("auth");
      localStorage.removeItem("address");
      localStorage.removeItem("Latitude");
      localStorage.removeItem("Longitude");
      dispatch({
        type: "logout",
      });
      nav("/login");
    }
  }
  const dispatch = useDispatch();

  const nav = useNavigate();
  const inputHandler = (e) => {
    const { id, value } = e.target;
    const tempUser = { ...user };
    tempUser[id] = value;
    setUser(tempUser);
    formik.setFieldValue(id, value);
    console.log(tempUser);
  };
  return (
    <>
      <Box w={"400px"} h={"100%"} bgColor={"#F2F4F7"} p={"20px"}>
        <Flex
          fontSize={"30px"}
          fontFamily={"sans-serif"}
          justifyContent={"space-between"}
          pl={"50px"}
          pb={"20px"}
          color={"#385898"}
          fontWeight={"600"}
        >
          <Center pt={"10px"}>Change Password</Center>
          <Center>
            <Icon
              color={"grey"}
              cursor={"pointer"}
              onClick={() => {
                props.onClose();
              }}
              as={AiOutlineClose}
            ></Icon>
          </Center>
        </Flex>

        <Center w="100%">
          <Flex
            bgColor={"white"}
            w="300px"
            flexDir={"column"}
            padding="20px"
            gap="10px"
            borderRadius={"10px"}
          >
            <Box>
              <Flex flexDir={"column"} gap={"20px"}>
                <InputGroup>
                  <Input
                    id="oldPassword"
                    onChange={inputHandler}
                    type={seepassword ? "text" : "password"}
                    border={"1px #878787 solid"}
                    placeholder="Old Password"
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
                    id="password"
                    onChange={inputHandler}
                    type={seepassword2 ? "text" : "password"}
                    border={"1px #878787 solid"}
                    placeholder="New Password"
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
                <Flex w={"100%"} fontSize={"12px"} color={"red"}>
                  {formik.errors.password}
                </Flex>
                <InputGroup>
                  <Input
                    id="password2"
                    onChange={inputHandler}
                    type={seepassword3 ? "text" : "password"}
                    border={"1px #878787 solid"}
                    placeholder="Confirm New Password"
                    paddingY={"8px"}
                  ></Input>
                  <InputRightElement width={"2.5rem"} h={"100%"}>
                    <IconButton
                      colorScheme="whiteAlpha"
                      color={"grey"}
                      as={seepassword3 ? AiOutlineEye : AiOutlineEyeInvisible}
                      w={"32px"}
                      h={"32px"}
                      onClick={() => setSeePassword3(!seepassword3)}
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
              bgColor="#385898"
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
    </>
  );
}
