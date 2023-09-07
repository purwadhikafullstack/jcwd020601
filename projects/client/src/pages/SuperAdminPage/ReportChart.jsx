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
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import Loading from "../../components/Loading";
import ModalFilterSales from "./ModalFilter";
export default function ReportChart() {
  const [loading, setLoading] = useState(true);
  const [salesCardData, setSalesCardData] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [salesChart, setSalesChart] = useState();
  const [quantityChart, setQuantityChart] = useState();
  const [filter, setFilter] = useState({
    time: "allTime",
    BranchId: "",
  });
  const [time, setTime] = useState("weekly");
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
      No1: `EARNINGS (${time?.toUpperCase() || ""})`,
      No2: salesChart?.total,
      No3: `Earnings from ${time?.toLowerCase() || ""}`,
      No4: AiFillCalendar,
      No4Color: "#6777ef",
    },
    {
      No1: `PRODUCT SOLD (${time?.toUpperCase() || ""})`,
      No2: quantityChart?.total,
      No3: `Product sold from ${time?.toLowerCase() || ""}`,
      No4: FaCartShopping,
      No4Color: "#3cde50",
    },
    {
      No1: `TRANSACTIONS (${time?.toUpperCase() || ""})`,
      No2: transactionChart?.total,
      No3: `Transactions from ${time?.toLowerCase() || ""}`,
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
    setTime(val.time);
    setSalesChart(sales.data);
    console.log(sales.data);
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
      <Flex bgColor={"#fbfbfb"} py={"10px"} marginLeft={{ base: 0, lg: 60 }}>
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
                <Flex
                  alignItems={{ base: "flex-start", lg: "center" }}
                  w={"100%"}
                  // bgColor={"red.100"}
                  gap={3}
                  flexDir={{ base: "column", lg: "row" }}
                >
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
              <Flex
                mt={"20px"}
                justifyContent={{ base: "flex-start", lg: "flex-start" }}
              >
                <Flex
                  gap={{ base: "20px", lg: "50px" }}
                  flexDir={{ base: "column", lg: "row" }}
                  justifyContent={"center"}
                  alignItems={"center"}
                  // bgColor={"red.100"}
                >
                  {objects.map((val, index) => {
                    return (
                      <Flex
                        w={"250px"}
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
                            w={"160px"}
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
                          <Flex fontSize={"0.8rem"} color={"green"}>
                            {val.No3}
                          </Flex>
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
                      onClick={() => {
                        modalFilter.onOpen();
                      }}
                      w={"150px"}
                      color={"white"}
                      bgColor={"#2c5282"}
                      fontSize={"0.9rem"}
                    >
                      Filter By Date Format
                    </Button>
                    <Button
                      isDisabled={filtered ? false : true}
                      onClick={() => {
                        fetchData();
                        setFilter({
                          time: "allTime",
                          BranchId: "",
                        });
                        setFiltered(false);
                      }}
                    >
                      Close Filter
                    </Button>
                  </Flex>
                  <Flex gap={"20px"} flexDir={{ base: "column", lg: "row" }}>
                    <Flex flexDir={"column"}>
                      <Flex
                        gap={"20px"}
                        mb={"20px"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Flex gap={"10px"} flexDir={"column"}>
                          <Flex
                            pl={"10px"}
                            fontSize={"1.2rem"}
                            color={"#2c5282"}
                            fontWeight={"600"}
                          >
                            Sales from{" "}
                            {time == "monthly"
                              ? "last month"
                              : time == "weekly"
                              ? "last week"
                              : "All Time"}
                          </Flex>
                          <Flex bgColor={"#f2f2f2"}>
                            <AreaChart
                              width={400}
                              height={250}
                              data={salesChart?.sales}
                              margin={{
                                top: 10,
                                right: 30,
                                left: 30,
                                bottom: 0,
                              }}
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
                      </Flex>
                      <Flex
                        gap={"10px"}
                        mb={{ base: "20px", lg: "100px" }}
                        backgroundColor={"white"}
                        flexDir={"column"}
                      >
                        <Flex
                          pl={"10px"}
                          fontSize={"1.2rem"}
                          color={"#2c5282"}
                          fontWeight={"600"}
                        >
                          Transactions from{" "}
                          {time == "monthly"
                            ? "last month"
                            : time == "weekly"
                            ? "last week"
                            : "All Time"}
                        </Flex>
                        <Flex bgColor={"#f2f2f2"} w={"400px"}>
                          <AreaChart
                            width={400}
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
                    <Flex gap={"10px"} flexDir={"column"}>
                      <Flex
                        pl={"10px"}
                        fontSize={"1.2rem"}
                        color={"#2c5282"}
                        fontWeight={"600"}
                      >
                        Product Qty Sold from{" "}
                        {time == "monthly"
                          ? "last month"
                          : time == "weekly"
                          ? "last week"
                          : "All Time"}
                      </Flex>
                      <Flex bgColor={"#f2f2f2"}>
                        <BarChart
                          margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
                          width={400}
                          height={560}
                          data={quantityChart?.sales}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis
                            type="number"
                            domain={[
                              0,
                              parseInt(quantityChart?.highest?.qty_sold),
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
                </Flex>
              </Flex>
            </Flex>
          )}
        </Flex>
        <ModalFilterSales
          setTime={setTime}
          time={time}
          setFilter={setFilter}
          filter={filter}
          submitFilter={submitFilter}
          modalFilter={modalFilter}
        />
      </Flex>
    </>
  );
}
