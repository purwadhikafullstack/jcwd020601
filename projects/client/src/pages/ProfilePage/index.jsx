import { Center, Flex, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProfileSidebar from "./ProfileSidebar";
import YupPassword from "yup-password";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import NavbarFooter from "../../components/NavbarFooter";
import Footer from "../../components/Footer";
import TabBar from "./TabBar";
import Biodata from "./Biodata";
import DaftarAlamat from "./DaftarAlamat";
import ProfileFooter from "./ProfileFooter";
import { api } from "../../api/api";
import MyOrders from "./MyOrders";
export default function ProfilePage() {
  const [userAddresses, setUserAddresses] = useState([]);
  const userSelector = useSelector((state) => state.login.auth);
  const [tab, setTab] = useState("biodata");
  const [sideTab, setSideTab] = useState("myAccount");
  const toast = useToast();
  async function fetchUserAddresses() {
    try {
      await api.get("/address/user/" + userSelector.id).then((res) => {
        setUserAddresses(res.data);
      });
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
  }
  YupPassword(Yup);
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
              <ProfileSidebar setSideTab={setSideTab} sideTab={sideTab} />
            </Flex>
            {sideTab == "myAccount" ? (
              <Flex flexDir={"column"} gap={"20px"}>
                <TabBar setTab={setTab} tab={tab} />
                {tab == "biodata" ? (
                  <Biodata userSelector={userSelector} />
                ) : tab == "daftarAlamat" ? (
                  <DaftarAlamat
                    setUserAddresses={setUserAddresses}
                    userAddresses={userAddresses}
                    fetchUserAddresses={fetchUserAddresses}
                    userSelector={userSelector}
                  />
                ) : (
                  <Flex>djas</Flex>
                )}
              </Flex>
            ) : sideTab == "myOrders" ? (
              <>
                <MyOrders />
              </>
            ) : (
              <></>
            )}
          </Flex>
        </Center>
        <Footer />
        <NavbarFooter />
      </Flex>
    </>
  );
}
