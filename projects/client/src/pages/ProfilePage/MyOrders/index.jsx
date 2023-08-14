import { Flex } from "@chakra-ui/react";
import TabBar from "./TabBar";
import { useState } from "react";
import Pending from "./Pending";
import History from "./History";

export default function MyOrders() {
  const [tab, setTab] = useState("Pending");
  return (
    <>
      <Flex flexDir={"column"}>
        <TabBar setTab={setTab} tab={tab} />
        {tab == "Pending" ? (
          <Pending />
        ) : tab == "History" ? (
          <History />
        ) : (
          <></>
        )}
      </Flex>
    </>
  );
}
