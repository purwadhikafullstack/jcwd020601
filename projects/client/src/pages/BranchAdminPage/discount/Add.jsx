import {
  Box,
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormLabel,
  Text,
  Select,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { GrFormAdd } from "react-icons/gr";
import { useState } from "react";

import { api } from "../../../api/api";
import "../../../App.css";
import { useSelector } from "react-redux";

export default function Add({ getData, token }) {
  const userSelector = useSelector((state) => state.login.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      discount: Yup.number()
        .required("Tidak boleh kosong!")
        .typeError("Isi dengan angka"),
      isPercent: Yup.string().required("Required!"),
      start: Yup.string().required("Required!"),
      end: Yup.string().required("Required!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await api.post("/discount/v1", values, {
        // headers: {
        //   Authorization: token,
        // },
      });
      onClose();
      resetForm({ values: "" });
      Swal.fire("Good job!", "Your data category has been Added.", "success");
      setTimeout(getData, 1000);
    },
  });

  console.log(formik.values);
  return (
    <>
      <Button onClick={onOpen} leftIcon={<GrFormAdd />} variant="outline">
        Add Discount
      </Button>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={scrollBehavior}
        size={"xl"}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Tambah Diskon</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={formik.handleSubmit}>
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
                  type="number"
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
              <Box gap={5} display={"flex"} my={5}>
                <Button type="submit" colorScheme="blue">
                  Submit
                </Button>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={(e) => {
                    onClose();
                    getData();
                  }}
                >
                  Close
                </Button>
              </Box>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
