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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import "../../../App.css";
import { GrFormAdd } from "react-icons/gr";
import { useState } from "react";
import { api } from "../../../api/api";

export default function Add({ getData, token }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = useState("inside");
  const formik = useFormik({
    initialValues: {
      category: "",
    },
    validationSchema: Yup.object({
      category: Yup.string()
        .trim()
        .required("Isi dalam bentuk karakter tidak boleh kosong"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await api().post("/category/v1", values, {
        headers: {
          Authorization: token,
        },
      });
      onClose();
      resetForm({ values: "" });
      Swal.fire("Good job!", "Your data category has been Added.", "success");
      setTimeout(getData, 1000);
    },
  });

  return (
    <>
      <Button onClick={onOpen} leftIcon={<GrFormAdd />} variant="outline">
        Add Categori
      </Button>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={scrollBehavior}
        size={"xl"}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Tambah Kategori</ModalHeader>
          <ModalBody gap={5} display={"flex"} flexDirection={"column"}>
            <form onSubmit={formik.handleSubmit}>
              <FormLabel>Categori</FormLabel>
              <Input
                placeholder="Categori"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
              />
              <Text color={"red.800"}>{formik.errors.category}</Text>

              <Box gap={5} display={"flex"} my={5}>
                <Button type="submit">Submit</Button>
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
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
