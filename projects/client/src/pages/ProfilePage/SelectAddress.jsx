import { Box, Flex, Icon } from "@chakra-ui/react";
import { GoVerified } from "react-icons/go";
import { GrRadialSelected } from "react-icons/gr";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { api } from "../../api/api";
import Swal from "sweetalert2";

export default function SelectAddress(val) {
  const dispatch = useDispatch();
  return (
    <>
      <Flex
        bg={"#e8e8e8"}
        w={"100%"}
        flexDir={"column"}
        _hover={{ bgColor: "#c7c7c7" }}
        cursor={"pointer"}
        onClick={async () => {
          try {
            const token = JSON.parse(localStorage.getItem("auth"));
            const checkAddress = await api().get(
              "address/getaddress/" + val.address.id
            );
            const user = await api()
              .get("/auth/v3?token=" + token)
              .then(async (res) => {
                return res.data;
              })
              .catch((err) => {
                return err.message;
              });
            localStorage.setItem("address", JSON.stringify(val.address));
            const closestBranch = await api()
              .post("/address/closest", {
                lat: val.address.latitude,
                lon: val.address.longitude,
              })
              .then((res) => res.data);
            dispatch({
              type: "login",
              payload: { token, ...user },
              address: val.address,
              closestBranch,
            });
            dispatch({
              type: "order",
              payload: {
                BranchId: closestBranch.BranchId,
                TooFar: closestBranch.TooFar,
                AddressId: val.address.id,
              },
            });
            val.modalSelectAddress.onClose();
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: err.response.data.message,
            });
            val.modalSelectAddress.onClose();
          }
        }}
      >
        <Flex
          w={"100%"}
          px={"20px"}
          pt={"10px"}
          alignItems={"center"}
          gap={"10px"}
          justifyContent={"space-between"}
        >
          <Flex
            fontWeight={"700"}
            color={"#385898"}
            alignItems={"center"}
            gap={"10px"}
          >
            {val.labelAlamat}
            {val.isMain ? (
              <Box border={"#385898 solid 1px"} fontSize={"0.6rem"} px={"5px"}>
                Main
              </Box>
            ) : (
              <></>
            )}
          </Flex>
          {val.userSelector?.address?.id == val.address?.id ? (
            <Icon
              fontSize={"30px"}
              color={"green"}
              as={IoCheckmarkCircleSharp}
            ></Icon>
          ) : (
            <></>
          )}
        </Flex>
        <Flex p={"20px"} flexDir={"column"}>
          <Flex fontWeight={600}>{"Nama : " + val.namaPenerima}</Flex>
          <Flex>{"Poscode : " + val.pos}</Flex>
          <Flex>{val.city + " - " + val.province}</Flex>
          <Flex>{"No. Telp : " + val.no_Handphone}</Flex>
        </Flex>
      </Flex>
    </>
  );
}
