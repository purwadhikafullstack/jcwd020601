import { Flex } from "@chakra-ui/react";
import TabBar from "./TabBar";
import { useState } from "react";

export default function MyOrders() {
  const [tab, setTab] = useState("Pending");
  return (
    <>
      <Flex>
        <TabBar setTab={setTab} tab={tab} />
      </Flex>
    </>
  );
}
