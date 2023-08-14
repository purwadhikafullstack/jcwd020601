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
  NumberInput,
  NumberInputField,
  Select,
  Text,
} from "@chakra-ui/react";
import { useFormik, Field } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import "../../../../App.css";
import { useEffect, useState, useRef } from "react";
import { api } from "../../../../api/api";
import moment from "moment";

export default function Edit({ isOpen, onClose, id, getData, token }) {
  const [scrollBehavior, setScrollBehavior] = useState("inside");
  const [book, setBook] = useState([]);
  const formik = useFormik({
    initialValues: {
      stock: 0,
      BookId: null,
      BranchId: 2,
    },
    validationSchema: Yup.object({
      stock: Yup.number().typeError("Isi dengan angka"),
      BookId: Yup.number().required("Required!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await api.patch(`/stock/v2/${id}`, values, {
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
    let res = await api.get(`/stock/${id}`, {
      // headers: {
      //   Authorization: token,
      // },
    });
    // console.log(typeof res.data.stock);
    formik.setValues({
      ...formik.values,
      stock: res.data.stock,
      BookId: res.data.BookId,
      BranchId: res.data.BranchId,
    });
    let response = await api.get("/book/all");
    setBook(response.data);
  };
  useEffect(() => {
    getDataDetail();
  }, [id, getData]);

  // console.log(id);
  // console.log(formik.values);
  // console.log(book);
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
                <FormLabel>Stock</FormLabel>
                {/* <NumberInput max={50} min={10}> */}
                <Input
                  placeholder="Jumlah Stock"
                  name="stock"
                  value={formik.values.stock}
                  type="number"
                  onChange={(e) => {
                    formik.handleChange(e);
                    // const stock = parseInt(e.target.value);
                    formik.setFieldValue("stock", parseInt(e.target.value));
                  }}
                />
                {/* </NumberInput> */}
                <Text color={"red.800"}>{formik.errors.stock}</Text>
              </Box>
              <Box>
                <FormLabel>Nama Buku</FormLabel>
                <Select
                  placeholder="Select Book"
                  name="BookId"
                  onChange={(e) => {
                    formik.handleChange(e);
                    const BookId = parseInt(e.target.value);
                    formik.setFieldValue("BookId", BookId);
                  }}
                  value={formik.values.BookId}
                >
                  {book.map((val, idx) => (
                    <option key={val.id} value={val.id}>
                      {val.title}
                    </option>
                  ))}
                </Select>
                <Text color={"red.800"}>{formik.errors.BookId}</Text>
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
                  getData();
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
