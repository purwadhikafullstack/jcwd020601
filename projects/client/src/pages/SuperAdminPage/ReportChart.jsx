import { Center, Flex, Icon } from "@chakra-ui/react";
import { AiFillApple, AiFillCalendar } from "react-icons/ai";
import { BiSolidUser } from "react-icons/bi";
import { FaCartShopping } from "react-icons/fa6";
import { RxLoop } from "react-icons/rx";

export default function ReportChart() {
  const objects = [
    {
      No1: "EARNINGS (WEEKLY)",
      No2: "$40.000",
      No3: "3.48% since last week",
      No4: AiFillCalendar,
      No4Color: "#6777ef",
    },

    {
      No1: "EARNINGS (WEEKLY)",
      No2: "$40.000",
      No3: "3.48% since last week",
      No4: FaCartShopping,
      No4Color: "green",
    },
    {
      No1: "EARNINGS (WEEKLY)",
      No2: "$40.000",
      No3: "3.48% since last week",
      No4: BiSolidUser,
      No4Color: "#38baf4",
    },

    {
      No1: "EARNINGS (WEEKLY)",
      No2: "$40.000",
      No3: "3.48% since last week",
      No4: RxLoop,
      No4Color: "#ffa425",
    },
  ];
  return (
    <>
      <Flex bgColor={"#f2f2f2"} pl={"20px"}>
        <Flex flexDir={"column"}>
          <Flex
            py={"20px"}
            fontSize={"2rem"}
            fontWeight={"600"}
            color={"#2c5282"}
          >
            DashBoard
          </Flex>
          <Flex>
            <Flex gap={"30px"}>
              {objects.map((val, index) => {
                return (
                  <Flex
                    p={"10px"}
                    boxShadow="0 0 5px #e0e0e0"
                    bgColor={"white"}
                    border={"1px"}
                    h={"100px"}
                    gap={"30px"}
                  >
                    <Flex flexDir={"column"}>
                      <Flex
                        fontWeight={"600"}
                        color={"#757575"}
                        fontSize={"0.8rem"}
                      >
                        {val.No1}
                      </Flex>
                      <Flex
                        fontWeight={"600"}
                        fontSize={"1.2rem"}
                        color={"#595858"}
                      >
                        {val.No2}
                      </Flex>
                      <Flex color={"green"}>{val.No3}</Flex>
                    </Flex>
                    <Center>
                      <Icon
                        color={val.No4Color}
                        fontSize={"40px"}
                        as={val.No4}
                      ></Icon>
                    </Center>
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
