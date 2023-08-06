import {
  Button,
  Center,
  Flex,
  IconButton,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  Box,
  useToast,
} from "@chakra-ui/react";
import logo from "../../assets/images/gramedia-icon-2.png";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { api } from "../../api/api";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useCallback } from "react";
import Options from "./Options";
import Inputs from "./Inputs";
export default function LoginPage() {
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "417414378341-aaj9jcihblf9ek3mo6kh86cq5rmc7ebs.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      width: 300,
      size: "medium",
    });
    google.accounts.id.prompt();
  }, []);
  async function handleCallbackResponse(response) {
    var userObject = jwt_decode(response.credential);
    try {
      let token;
      const loggingIn = await api
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
      if (loggingIn) {
        const user = await api
          .get("/auth/v3?token=" + token)
          .then(async (res) => {
            return res.data;
          })
          .catch((err) => {
            console.log(err.message);
            return err.message;
          });
        const userMainAddress = await api
          .get("/address/ismain/" + user.id)
          .then((res) => {
            localStorage.setItem("address", JSON.stringify(res.data));

            console.log(res.data);

            return res.data;
          })
          .catch((err) => {
            return err.message;
          });
        if (user.email) {
          dispatch({
            type: "login",
            payload: user,
            address: userMainAddress,
          });
          nav("/");
        }
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  }
  const handleKeyPress = useCallback((event) => {
    if (event.key === "Enter") {
      document.getElementById("submit").click();
    }
  }, []);
  const [seePassword, setSeePassword] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const [login, setLogin] = useState({
    emus: "",
    password: "",
  });
  const nav = useNavigate();
  function inputHandler(input) {
    const { value, id } = input.target;
    const tempobject = { ...login };
    tempobject[id] = value;
    setLogin(tempobject);
    console.log(tempobject);
  }
  return (
    <>
      <Center flexDir={"column"} gap={"10px"} pt={"30px"} w={"100%"}>
        <Center flexDir={"column"} gap={"80px"}>
          <Center flexDir={"column"}>
            <Center gap={"12px"} flexDir={"column"}>
              <Center
                className={"loginpage-container"}
                flexDir={"column"}
                border={"1px solid #dbdbdb"}
              >
                <Img src={logo} width={"300px"} py={"40px"}></Img>
                <Inputs
                  toast={toast}
                  dispatch={dispatch}
                  login={login}
                  inputHandler={inputHandler}
                  nav={nav}
                  handleKeyPress={handleKeyPress}
                  AiOutlineEye={AiOutlineEye}
                  seePassword={seePassword}
                  setSeePassword={setSeePassword}
                  AiOutlineEyeInvisible={AiOutlineEyeInvisible}
                />
              </Center>
              <Center
                className="loginpage-border"
                height={"60px"}
                flexDir={"column"}
                border={"1px solid #dbdbdb"}
                paddingY={"20px"}
              >
                <Flex fontSize={"14px"}>
                  Don't Have An Account?{" "}
                  <Flex
                    fontSize={"14px"}
                    color={"#0060ae"}
                    cursor={"pointer"}
                    onClick={() => nav("/register")}
                  >
                    &nbsp;Sign Up
                  </Flex>
                </Flex>
              </Center>
            </Center>
          </Center>
          <Options />
        </Center>
        <Center color={"blackAlpha.700"} gap={"20px"}>
          <Flex fontSize={"13px"}> English</Flex>
          <Flex fontSize={"13px"}> © 2023 Gramedia from Meta</Flex>
        </Center>
      </Center>
    </>
  );
}
