import { Center, Flex, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function VerifyEmail() {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [token, setToken] = useState();

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

  async function Verify() {
    await api()
      .get("auth/token/verifyemail?token=" + token, {
        user,
      })
      .then((res) => {
        alert(res.data.message);
        // window.location.reload(false);
        nav("/login");
      })
      .catch((err) => {
        alert("Tokena has expired");
        nav("/");
      });
  }

  useEffect(() => {
    const token2 = location.pathname.split("/")[2]; // ini variable sementara untuk nampung
    fetchUser(token2);
    setToken(token2);
  }, []);

  const dispatch = useDispatch();

  const nav = useNavigate();

  const [seepassword, setSeePassword] = useState(false);

  return (
    <>
      {user.id ? (
        <Center h={"100vh"} flexDir={"column"}>
          <Flex>Account Verification</Flex>
          <Button onClick={() => Verify()}>Verify</Button>
        </Center>
      ) : (
        <Center h="100vh">
          <h1> Link has Expired </h1>
        </Center>
      )}
    </>
  );
}
