import { Center, Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function Greetings() {
  const userSelector = useSelector((state) => state.login.auth);
  const locatio = useLocation();
  const location = locatio.pathname.split("/")[2];
  return (
    <>
      <Flex w={"100%"} borderBottom={"2px solid #787875"} pb={"10px"}>
        <Flex alignItems={"center"} w={"100%"}>
          <Flex flexDir={"column"}>
            <Flex
              fontSize={"1.2rem"}
              fontWeight={"700"}
              width={"200px"}
              color={"#2c5282"}
              onClick={() => {
                console.log(userSelector);
                console.log(location);
              }}
            >
              {"Welcome, " + userSelector.admin_name}
            </Flex>
            <Flex fontSize={"0.8rem"} fontWeight={"600"} color={"#787875"}>
              {"This is The " +
                location.charAt(0).toUpperCase() +
                location.slice(1) +
                " Section"}
            </Flex>
          </Flex>

          <Center
            w={"100%"}
            fontWeight={"600"}
            color={"#787875"}
            fontSize={"1.2rem"}
          >
            This is where you can see orders from different branches and edit
            them
          </Center>
        </Flex>
      </Flex>
    </>
  );
}
