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
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useEffect, useState, useRef } from "react";
import { api } from "../../../api/api";
import "../../../App.css";
export default function Edit({ isOpen, onClose, id, getData, token }) {
  const [scrollBehavior, setScrollBehavior] = useState("inside");
  const formik = useFormik({
    initialValues: {
      category: "",
    },
    enableReinitialze: true,
    validationSchema: Yup.object({
      category: Yup.string().required("required!").trim("Tidak boleh kosong"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await api().patch(`/category/v2/${id}`, values, {
        headers: {
          Authorization: token,
        },
      });
      onClose();
      resetForm({ values: "" });
      Swal.fire("Good job!", "Your data has been Updated.", "success");
      setTimeout(getData, 1000);
    },
  });
  const getDataDetail = async () => {
    let res = await api().get(`/category/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    formik.setValues({ ...formik.values, category: res.data.result.category });
  };
  useEffect(() => {
    getDataDetail();
  }, [id]);
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
            <ModalHeader>Edit Categori</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Categori"
                name="category"
                type="text"
                value={formik.values.category}
                onChange={formik.handleChange}
              />
              <Text color={"red.800"}>{formik.errors.category}</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
