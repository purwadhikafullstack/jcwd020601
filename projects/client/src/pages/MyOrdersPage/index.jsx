import { Center, Flex, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProfileSidebar from "../ProfilePage/ProfileSidebar";
import YupPassword from "yup-password";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import NavbarFooter from "../../components/NavbarFooter";
import Footer from "../../components/Footer";
import ProfileFooter from "../ProfilePage/ProfileFooter";
import { api } from "../../api/api";
import MyOrders from "./MyOrders";
import Loading from "./";
export default function MyOrdersPage() {
  const userSelector = useSelector((state) => state.login.auth);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  async function fetcha() {
    try {
      setIsLoading(true);
      const pendingOrder = await api()
        .get("/order/pending/" + userSelector.id)
        .then((res) => res.data);
      const historyOrder = await api()
        .get("/order/history/" + userSelector.id)
        .then((res) => res.data);
      setHistory(historyOrder);
      setPending(pendingOrder);
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
    setIsLoading(false);
  }
  useEffect(() => {
    fetcha();
  }, []);

  return (
    <>
      <Flex flexDir={"column"}>
        <Flex
          display={{
            base: "block",
            sm: "none",
          }}
        >
          <ProfileFooter Center={Center} />
        </Flex>
        <Navbar />
        <Center>
          <Flex gap={"40px"}>
            <Flex
              display={{
                base: "none",
                sm: "block",
              }}
            >
              <ProfileSidebar />
            </Flex>
            <MyOrders
              isLoading={isLoading}
              pending={pending}
              history={history}
              setHistory={setHistory}
              setPending={setPending}
            />
          </Flex>
        </Center>
        <Footer />
        <NavbarFooter />
      </Flex>
    </>
  );
}
