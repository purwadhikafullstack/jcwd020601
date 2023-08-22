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
    const latitude = JSON.parse(localStorage.getItem("Latitude"));
    const longitude = JSON.parse(localStorage.getItem("Longitude"));
    try {
      let token;
      const loggingIn = await api()
        .post("/auth/v2", props.login)
        .then((res) => {
          localStorage.setItem("auth", JSON.stringify(res.data.token));
          token = res.data.token;
          Swal.fire("Good job!", "Login succesful", "success");
          return res.data.message;
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.data.message,
          });
        });
      if (loggingIn) {
        const token = JSON.parse(localStorage.getItem("auth"));
        console.log(token);
        const user = await api()
          .get("/auth/v3?token=" + token)
          .then((res) => res.data)
          .catch((err) => {
            console.log(err.message);
          });
        const userMainAddress = await api()
          .get("/address/ismain/" + user.id)
          .then((res) => {
            localStorage.setItem("address", JSON.stringify(res.data));
            return res.data;
          })
          .catch((err) => err.message);
        const closestBranch = await api()
          .post(
            "/address/closest",
            userMainAddress
              ? {
                  lat: userMainAddress.latitude,
                  lon: userMainAddress.longitude,
                }
              : {
                  lat: latitude,
                  lon: longitude,
                }
          )
          .then((res) => res.data)
          .catch((err) => console.log(err));
        if (user.email) {
          console.log({ token, ...user });
          console.log(user);
          if (closestBranch.message) {
            props.dispatch({
              type: "login",
              payload: { token, ...user },
              address: userMainAddress,
            });
            props.dispatch({
              type: "order",
              payload: {
                BranchId: closestBranch.BranchId,
                AddressId: userMainAddress?.id,
                TooFar: true,
              },
            });
          } else {
            props.dispatch({
              type: "login",
              payload: { token, ...user },
              address: userMainAddress,
            });
            props.dispatch({
              type: "order",
              payload: {
                BranchId: closestBranch.BranchId,
                AddressId: userMainAddress?.id,
              },
            });
          }
          props.nav("/");
        }
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
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
