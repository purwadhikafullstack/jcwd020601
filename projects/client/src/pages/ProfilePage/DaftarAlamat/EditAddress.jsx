import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import Swal from "sweetalert2";
import * as Yup from "yup";
import YupPassword from "yup-password";
import ModalEditAddress from "./ModalEditAddress";
import { useDispatch, useSelector } from "react-redux";
import Helpers from "./EditAddressHelper";
export default function EditAddress(val) {
  YupPassword(Yup);
  const [block, setBlock] = val.useState();
  const [fetchBoth, setFetchBoth] = val.useState(true);
  const [reset, setReset] = val.useState(true);
  const [block2, setBlock2] = val.useState();
  const [provinces, setProvinces] = val.useState([]);
  const [cities, setCities] = val.useState([]);
  const [posCodes, setPosCodes] = val.useState(val.addressUser.pos);
  const [provinceId, setProvinceId] = val.useState(val.addressUser.ProvinceId);
  const [cityId, setCityId] = val.useState(val.addressUser.CityId);
  const token = JSON.parse(localStorage.getItem("auth"));
  const dispatch = useDispatch();
  const initialState = {
    province: {
      provinceName: val.addressUser.province,
      ProvinceId: val.addressUser.ProvinceId,
    },
    city: {
      cityName: val.addressUser.city,
      CityId: val.addressUser.CityId,
    },
    pos: val.addressUser.pos,
    labelAlamat: val.addressUser.labelAlamat,
    namaPenerima: val.addressUser.namaPenerima,
    no_Handphone: val.addressUser.no_Handphone,
    alamatLengkap: val.addressUser.alamatLengkap,
  };
  const [
    {
      province,
      city,
      pos,
      labelAlamat,
      namaPenerima,
      no_Handphone,
      alamatLengkap,
    },
    setState,
  ] = useState(initialState);
  async function changeMain() {
    await Helpers.changeMain({ val, token, Swal, api, dispatch });
  }
  async function deleteAddress() {
    await Helpers.delAddress({ val, token, dispatch, Swal, modalEditAddress });
    formikAddress.resetForm();
  }
  async function fetchCity() {
    const cityResult = await api().get("/city/v1/" + provinceId);
    setCities(cityResult.data.result);
  }
  async function fetchPos() {
    const posCodesResult = await api().get("/city/v2/" + cityId);
    setPosCodes(posCodesResult.data.result);
  }
  useEffect(() => {
    const fetchData = async () => {
      const provincesResult = await api().get("province");
      setProvinces(provincesResult.data.result);
    };
    fetchData();
  }, []);
  const formikAddress = useFormik({
    enableReinitialize: true,
    initialValues: {
      no_Handphone: val.addressUser.no_Handphone,
      namaPenerima: val.addressUser.namaPenerima,
      labelAlamat: val.addressUser.labelAlamat,
      province: val.addressUser.ProvinceId + "#" + val.addressUser.province,
      city: val.addressUser.CityId + "#" + val.addressUser.city,
      pos: val.addressUser.pos,
      alamatLengkap: val.addressUser.alamatLengkap,
    },
    validationSchema: Helpers.validationSchemaAddress,
    onSubmit: async () => {
      setReset(false);
      await Helpers.submit({
        val,
        token,
        Swal,
        dispatch,
        formikAddress,
        modalEditAddress,
        setState,
        initialState,
      });
    },
  });
  async function inputHandlerAddress(input) {
    setReset(true);
    const { value, id } = input.target;
    setState((prevState) => ({ ...prevState, [id]: value }));
    if (id == "province") {
      setProvinceId(value.split("#")[0]);
      formikAddress.setFieldValue(id, value);
    } else if (id == "city") {
      setCityId(value.split("#")[0]);
      formikAddress.setFieldValue(id, value);
    } else formikAddress.setFieldValue(id, value);
  }
  useEffect(() => {
    fetchCity();
    fetchPos();
  }, [fetchBoth]);
  useEffect(() => {
    fetchCity();
    if (block && reset) {
      formikAddress.setFieldValue("city", "");
      setState((prevState) => ({ ...prevState, ["city"]: "" }));
    }
    setBlock(true);
  }, [formikAddress.values.province]);
  useEffect(() => {
    fetchPos();
    if (block2 && reset) {
      formikAddress.setFieldValue("pos", "");
      setState((prevState) => ({ ...prevState, ["pos"]: "" }));
    }
    setBlock2(true);
  }, [formikAddress.values.city]);
  const modalEditAddress = useDisclosure();
  return (
    <>
      <Flex
        bg={"#f5f5f5"}
        w={"100%"}
        flexDir={"column"}
        border={val.selectIsMain ? "2px solid #385898" : ""}
        onClick={
          val.selectIsMain
            ? () => changeMain()
            : () => modalEditAddress.onOpen()
        }
        _hover={{ bgColor: "#c7c7c7", cursor: "pointer" }}
      >
        <Flex px={"20px"} pt={"10px"} alignItems={"center"} gap={"10px"}>
          <Flex fontWeight={"700"} color={"#385898"}>
            {val.addressUser.labelAlamat}
          </Flex>
          {val.addressUser.isMain ? (
            <Box border={"#385898 solid 1px"} fontSize={"0.6rem"} px={"5px"}>
              Main
            </Box>
          ) : (
            <></>
          )}
        </Flex>
        <Flex p={"20px"} flexDir={"column"}>
          <Flex fontWeight={600}>
            {"Nama : " + val.addressUser.namaPenerima}
          </Flex>
          <Flex>{"Poscode : " + val.addressUser.pos}</Flex>
          <Flex>{val.addressUser.city + " - " + val.addressUser.province}</Flex>
          <Flex>{"No. Telp : " + val.addressUser.no_Handphone}</Flex>
        </Flex>
        <ModalEditAddress
          modalEditAddress={modalEditAddress}
          setReset={setReset}
          setState={setState}
          setProvinceId={setProvinceId}
          setCityId={setCityId}
          alamatLengkap={alamatLengkap}
          no_Handphone={no_Handphone}
          labelAlamat={labelAlamat}
          deleteAddress={deleteAddress}
          namaPenerima={namaPenerima}
          pos={pos}
          posCodes={posCodes}
          city={city}
          province={province}
          cities={cities}
          provinces={provinces}
          formikAddress={formikAddress}
          inputHandlerAddress={inputHandlerAddress}
          val={val}
          initialState={initialState}
          fetchBoth={fetchBoth}
          setFetchBoth={setFetchBoth}
        />
      </Flex>
    </>
  );
}
