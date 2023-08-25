import {
  Box,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormLabel,
  ModalCloseButton,
  useEditableControls,
  Flex,
  Editable,
  Select,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useEffect, useState, useRef } from "react";

import moment from "moment";
import { api } from "../../../api/api";
import "../../../App.css";
import { useSelector } from "react-redux";

export default function Edit({ isOpen, onClose, id, getData, token }) {
  const userSelector = useSelector((state) => state.login.auth);
  const [scrollBehavior, setScrollBehavior] = useState("inside");
  const formik = useFormik({
    initialValues: {
      title: "",
      discount: "",
      isPercent: null,
      start: "",
      end: "",
      BranchId: userSelector.branchId,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .trim()
        .required("Isi dalam bentuk karakter tidak boleh kosong"),
      discount: Yup.number().required("Required!"),
      isPercent: Yup.string().required("Required!"),
      start: Yup.string().required("Required!"),
      end: Yup.string().required("Required!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await api().patch(`/discount/v2/${id}`, values, {
        // headers: {
        //   Authorization: token,
        // },
      });
      onClose();
      resetForm({ values: "" });
      Swal.fire("Good job!", "Your data has been Updated.", "success");
      setTimeout(getData, 1000);
    },
  });
  const getDataDetail = async () => {
    let res = await api().get(`/discount/${id}`, {
      // headers: {
      //   Authorization: token,
      // },
    });
    console.log(res);
    formik.setValues({
      ...formik.values,
      title: res.data.result.title,
      discount: res.data.result.discount,
      isPercent: res.data.result.isPercent,
      start: moment(res.data.start).format("YYYY-MM-DD"),
      end: moment(res.data.end).format("YYYY-MM-DD"),
    });
  };
  useEffect(() => {
    getDataDetail();
  }, [id, getData]);

  return (
    <>
      <Text>Edit Data</Text>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={scrollBehavior}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <ModalHeader>Edit Discount</ModalHeader>
            <ModalCloseButton />
            <ModalBody gap={5} display={"flex"} flexDirection={"column"}>
              <Box>
                <FormLabel>Nama Diskon</FormLabel>
                <Input
                  placeholder="Nama Diskon"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.title}</Text>
              </Box>

              <Box>
                <FormLabel>Jumlah Diskon</FormLabel>
                <Input
                  placeholder="Jumlah Diskon"
                  name="discount"
                  value={formik.values.discount}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.discount}</Text>
              </Box>

              <Box>
                <FormLabel>Apakah dalam bentuk persen ?</FormLabel>
                <Select
                  placeholder="Pilih"
                  name="isPercent"
                  value={formik.values.isPercent}
                  onChange={formik.handleChange}
                >
                  <option value={true}>Ya</option>
                  <option value={false}>Tidak</option>
                </Select>
                <Text color={"red.800"}>{formik.errors.isPercent}</Text>
              </Box>
              <Box>
                <FormLabel>Tanggal Mulai</FormLabel>
                <input
                  type="date"
                  name="start"
                  value={formik.values.start}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.start}</Text>
              </Box>
              <Box>
                <FormLabel>Tanggal Berakhir</FormLabel>
                <input
                  type="date"
                  name="end"
                  value={formik.values.end}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.end}</Text>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Save
              </Button>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={(e) => {
                  onClose();
                  // getData();
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
