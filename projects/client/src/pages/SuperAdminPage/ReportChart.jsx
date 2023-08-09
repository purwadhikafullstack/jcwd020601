import { Center, Flex, Icon } from "@chakra-ui/react";
import { AiFillApple, AiFillCalendar } from "react-icons/ai";
import { BiSolidUser } from "react-icons/bi";
import { FaCartShopping } from "react-icons/fa6";
import { RxLoop } from "react-icons/rx";
import {
  AreaChart,
  YAxis,
  XAxis,
  CartesianGrid,
  Area,
  Tooltip,
  BarChart,
  Legend,
  Bar,
} from "recharts";
export default function ReportChart() {
  const data = [
    {
      name: "2023/8/1",
      uv: 40000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "2023/8/2",
      uv: 35000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "2023/8/3",
      uv: 30000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "2023/8/4",
      uv: 25000,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "2023/8/5",
      uv: 20000,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "2023/8/6",
      uv: 15000,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "2023/8/7",
      uv: 10000,
      pv: 4300,
      amt: 2100,
    },
  ];
  const objects = [
    {
      No1: "EARNINGS (WEEKLY)",
      No2: "$40.000",
      No3: "3.48% since last week",
      No4: AiFillCalendar,
      No4Color: "#6777ef",
    },

    {
      No1: "SALES (WEEKLY)",
      No2: "$40.000",
      No3: "3.48% since last week",
      No4: FaCartShopping,
      No4Color: "green",
    },
    {
      No1: "NEW USERS",
      No2: "$40.000",
      No3: "3.48% since last week",
      No4: BiSolidUser,
      No4Color: "#38baf4",
    },

    {
      No1: "ONGOING TRANSACTION",
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
            <Flex gap={"50px"}>
              {objects.map((val, index) => {
                return (
                  <Flex
                    p={"10px"}
                    boxShadow="0 0 5px #e0e0e0"
                    bgColor={"white"}
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
          <Flex mt={"30px"} bgColor={"#f2f2f2"} gap={"20px"} mb={"200px"}>
            <Flex gap={"10px"} backgroundColor={"white"} flexDir={"column"}>
              <Flex
                pl={"10px"}
                fontSize={"1.2rem"}
                textDecor={"underline"}
                color={"#2c5282"}
                fontWeight={"600"}
              >
                Sales from last month
              </Flex>
              <Flex>
                <AreaChart
                  width={600}
                  height={250}
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={1} />
                      <stop offset="95%" stopColor="8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              </Flex>
            </Flex>

            <Flex gap={"10px"} backgroundColor={"white"} flexDir={"column"}>
              <Flex
                pl={"10px"}
                fontSize={"1.2rem"}
                textDecor={"underline"}
                color={"#2c5282"}
                fontWeight={"600"}
              >
                Sales from last month
              </Flex>
              <BarChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
              </BarChart>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
