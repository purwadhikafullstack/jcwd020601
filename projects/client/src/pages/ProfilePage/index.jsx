import { Center, Flex } from "@chakra-ui/react";
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
export default function ProfilePage() {
  const userSelector = useSelector((state) => state.login.auth);
  const [tab, setTab] = useState("biodata");
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
          <ProfileFooter />
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
            <Flex flexDir={"column"} gap={"20px"} justifyContent={"center"}>
              <TabBar setTab={setTab} tab={tab} />
              {tab == "biodata" ? (
                <Biodata userSelector={userSelector} />
              ) : tab == "daftarAlamat" ? (
                <DaftarAlamat userSelector={userSelector} />
              ) : (
                <Flex>djas</Flex>
              )}
            </Flex>
          </Flex>
        </Center>

        <Footer />
        <NavbarFooter />
      </Flex>
    </>
  );
}
