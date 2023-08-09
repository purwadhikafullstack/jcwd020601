import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { api } from "../../api/api";
import Swal from "sweetalert2";

export default function Inputs(props) {
  async function submitLogin() {
    try {
      let token;
      await api.post("/auth/v2", props.login).then((res) => {
        localStorage.setItem("auth", JSON.stringify(res.data.token));
        token = res.data.token;
        console.log(token);
        Swal.fire("Good job!", "Login succesful", "success");
      });
      const user = await api
        .get("/auth/v3?token=" + token)
        .then(async (res) => {
          return res.data;
        })
        .catch((err) => {
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
      props.dispatch({
        type: "login",
        payload: user,
        address: userMainAddress,
      });
      props.nav("/");
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
    }
  }
  return (
    <>
      <Center flexDir={"column"} className="loginpage-inputs">
        <Input
          maxLength={32}
          fontSize={"12px"}
          bgColor={"#fafafa"}
          placeholder="Email or Phone Number"
          pl={"15px"}
          onChange={props.inputHandler}
          id="emus"
        ></Input>
        <InputGroup>
          <Input
            id="password"
            onKeyPress={props.handleKeyPress}
            maxLength={32}
            onChange={props.inputHandler}
            fontSize={"12px"}
            type={props.seePassword ? "text" : "password"}
            border={"1px #878787 solid"}
            placeholder="Create your password"
          ></Input>
          <InputRightElement width={"2.5rem"} h={"100%"}>
            <IconButton
              colorScheme="whiteAlpha"
              color={"grey"}
              as={
                props.seePassword
                  ? props.AiOutlineEye
                  : props.AiOutlineEyeInvisible
              }
              w={"24px"}
              h={"24px"}
              onClick={() => props.setSeePassword(!props.seePassword)}
              cursor={"pointer"}
            ></IconButton>
          </InputRightElement>
        </InputGroup>
        <Button
          color={"white"}
          borderRadius={"10px"}
          id="submit"
          w={"100%"}
          colorScheme="facebook"
          onClick={() => submitLogin()}
        >
          Login
        </Button>
        <Center gap={"10px"}>
          <Flex h={"2px"} w={"130px"} bgColor={"blackAlpha.300"}></Flex>
          <Flex>OR</Flex>
          <Flex h={"2px"} w={"130px"} bgColor={"blackAlpha.300"}></Flex>
        </Center>
        <Flex gap={"10px"}>
          <Box fontWeight={"700"} id="signInDiv"></Box>
        </Flex>
        <Flex
          pb={"24px"}
          fontSize={"12px"}
          className="loginpage-forgot-password"
          onClick={() => props.nav("/forgot-password/request")}
        >
          Forgot password?
        </Flex>
      </Center>
    </>
  );
}
