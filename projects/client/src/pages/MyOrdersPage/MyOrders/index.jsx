import { Flex } from "@chakra-ui/react";
import TabBar from "./TabBar";
import { useState } from "react";
import Pending from "./Pending";
import History from "./History";

export default function MyOrders(props) {
  const [tab, setTab] = useState("Pending");
  return (
    <>
      <Flex flexDir={"column"}>
        <TabBar setTab={setTab} tab={tab} />
        {tab == "Pending" ? (
          <Pending pending={props.pending} setPending={props.setPending} />
        ) : tab == "History" ? (
          <History history={props.history} setHistory={props.setHistory} />
        ) : (
          <></>
        )}
      </Flex>
    </>
  );
}
