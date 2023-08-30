import { Button, Center, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import { AiFillApple, AiFillCalendar } from "react-icons/ai";
import { BiSolidUser } from "react-icons/bi";
import { FaCartShopping } from "react-icons/fa6";
import { RxLoop } from "react-icons/rx";
import { useSelector } from "react-redux";
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
import Greetings from "./Greetings";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import Loading from "../../components/Loading";
import ModalFilterSales from "./ModalFilter";
const { nanoid } = require("nanoid");

export default function ReportChart() {
  const [loading, setLoading] = useState(true);
  const [salesCardData, setSalesCardData] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [salesChart, setSalesChart] = useState();
  const [quantityChart, setQuantityChart] = useState();
  const [transactionChart, setTransactionChart] = useState();
  const userSelector = useSelector((state) => state.login.auth);
  const modalFilter = useDisclosure();
  const CustomYAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
      <text x={x} y={y + 5} textAnchor="end" fill="#666" fontSize={"12px"}>
        {"Rp." + payload.value.toLocaleString()}
      </text>
    );
  };

  const objects = [
    {
      No1: "EARNINGS (WEEKLY)",
      No2: salesCardData.TotalSales,
      No3: "3.48% since last week",
      No4: AiFillCalendar,
      No4Color: "#6777ef",
    },
    {
      No1: "PRODUCTS SOLD (WEEKLY)",
      No2: salesCardData.TotalSold,
      No3: "3.48% since last week",
      No4: FaCartShopping,
      No4Color: "#3cde50",
    },
    {
      No1: "TRANSACTIONS",
      No2: salesCardData.TotalTransaction,
      No3: "3.48% since last week",
      No4: RxLoop,
      No4Color: "#ffa425",
    },
  ];
  async function fetchSalesCardData() {
    const total = await api().get(`/order/totalsales/week`);
    setSalesCardData(total.data);
    setLoading(false);
  }
  async function fetchData() {
    const sales = await api().get(`/order/sales`);
    const quantity = await api().get(`/order/qty`);
    const transaction = await api().get(`/order/transaction`);
    setSalesChart(sales.data);
    setQuantityChart(quantity.data);
    setTransactionChart(transaction.data);
    setLoading(false);
  }
  async function submitFilter(val) {
    const sales = await api().get(
      `/order/sales/` + val.BranchId + "?time=" + val.time
    );
    const quantity = await api().get(
      `/order/qty/` + val.BranchId + "?time=" + val.time
    );
    const transaction = await api().get(
      `/order/transaction/` + val.BranchId + "?time=" + val.time
    );
    setSalesChart(sales.data);
    setQuantityChart(quantity.data);
    setTransactionChart(transaction.data);
    setFiltered(true);
    setLoading(false);
  }
  useEffect(() => {
    fetchSalesCardData();
    fetchData();
  }, []);
  return (
    <>
      <Flex
        bgColor={"#fbfbfb"}
        py={"10px"}
        // backgroundColor={"red.100"}
        marginLeft={60}
      >
        <Flex
          ml={"10px"}
          px={"10px"}
          flexDir={"column"}
          gap={"10px"}
          w={"100%"}
        >
          {loading ? (
            <Center>
              <Loading />
            </Center>
          ) : (
            <Flex flexDir={"column"}>
              <Flex w={"100%"} borderBottom={"2px solid #787875"} pb={"10px"}>
                <Flex alignItems={"center"} w={"100%"}>
                  <Flex flexDir={"column"}>
                    <Flex
                      fontSize={"1.2rem"}
                      fontWeight={"700"}
                      width={"200px"}
                      color={"#2c5282"}
                    >
                      {"Welcome, " + userSelector.admin_name}
                    </Flex>
                    <Flex
                      fontSize={"0.8rem"}
                      fontWeight={"600"}
                      color={"#787875"}
                    >
                      This is The Sales Report Section
                    </Flex>
                  </Flex>
                  <Center
                    w={"100%"}
                    fontWeight={"600"}
                    color={"#787875"}
                    fontSize={"1.2rem"}
                    flexWrap={"wrap"}
                  >
                    This is where you can see all the sales from different
                    branches
                  </Center>
                </Flex>
              </Flex>
              <Flex mt={"20px"}>
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
              <Flex mt={"20px"}>
                <Flex flexDir={"column"} gap={"10px"}>
                  <Flex gap={"20px"}>
                    <Button
                      onClick={modalFilter.onOpen}
                      w={"150px"}
                      color={"white"}
                      bgColor={"#2c5282"}
                    >
                      Filter By Month
                    </Button>
                    <Button
                      isDisabled={filtered ? false : true}
                      onClick={() => {
                        fetchData();
                        setFiltered(false);
                      }}
                    >
                      Close Filter
                    </Button>
                  </Flex>

                  <Flex
                    bgColor={"white"}
                    gap={"20px"}
                    mb={"20px"}
                    alignItems={"center"}
                  >
                    <Flex
                      gap={"10px"}
                      backgroundColor={"white"}
                      flexDir={"column"}
                    >
                      <Flex
                        pl={"10px"}
                        fontSize={"1.2rem"}
                        textDecor={"underline"}
                        color={"#2c5282"}
                        fontWeight={"600"}
                      >
                        Sales from last month
                      </Flex>
                      <Flex bgColor={"#f2f2f2"}>
                        <AreaChart
                          width={400}
                          height={250}
                          data={salesChart?.sales}
                          margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorUv"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#8884d8"
                                stopOpacity={1}
                              />
                              <stop
                                offset="95%"
                                stopColor="8884d8"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" />
                          <YAxis
                            tick={CustomYAxisTick}
                            type="number"
                            domain={[
                              0,
                              parseInt(salesChart?.highest?.total_sales),
                            ]}
                          />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="total_sales"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorUv)"
                          />
                        </AreaChart>
                      </Flex>
                    </Flex>
                    <Flex gap={"10px"} flexDir={"column"}>
                      <Flex
                        pl={"10px"}
                        fontSize={"1.2rem"}
                        textDecor={"underline"}
                        color={"#2c5282"}
                        fontWeight={"600"}
                      >
                        Product Qty Sold from last month
                      </Flex>
                      <Flex bgColor={"#f2f2f2"}>
                        <BarChart
                          margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
                          width={400}
                          height={250}
                          data={quantityChart?.sales}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis
                            type="number"
                            domain={[
                              0,
                              parseInt(quantityChart?.highest.qty_sold),
                            ]}
                          />
                          <Tooltip
                            formatter={(value) => value.toLocaleString("id-ID")}
                          />
                          <Legend />
                          <Bar dataKey="qty_sold" fill="#3cde50" />
                        </BarChart>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Flex
                    gap={"10px"}
                    mb={"100px"}
                    backgroundColor={"white"}
                    flexDir={"column"}
                  >
                    <Flex
                      pl={"10px"}
                      fontSize={"1.2rem"}
                      textDecor={"underline"}
                      color={"#2c5282"}
                      fontWeight={"600"}
                    >
                      Transactions from last month
                    </Flex>
                    <Flex bgColor={"#f2f2f2"}>
                      <AreaChart
                        width={800}
                        height={250}
                        data={transactionChart?.sales}
                        margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorUva"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#ffa425"
                              stopOpacity={1}
                            />
                            <stop
                              offset="95%"
                              stopColor="#ffa425"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis
                          type="number"
                          domain={[
                            0,
                            parseInt(
                              transactionChart?.highest?.total_transaction
                            ),
                          ]}
                        />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="total_transaction"
                          stroke="black"
                          fillOpacity={1}
                          fill="url(#colorUva)"
                        />
                      </AreaChart>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          )}
        </Flex>
        <ModalFilterSales
          submitFilter={submitFilter}
          modalFilter={modalFilter}
        />
      </Flex>
    </>
  );
}
