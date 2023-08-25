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
import { useEffect, useState, useRef } from "react";
import moment from "moment";
// import { api } from "../../../api/api";
// api
import "../../../App.css";
import { useSelector } from "react-redux";
import { api } from "../../../api/api";

export default function Edit({ isOpen, onClose, id, getData, token }) {
  // useSelector
  const userSelector = useSelector((state) => state.login.auth);
  const [scrollBehavior, setScrollBehavior] = useState("inside");
  const [book, setBook] = useState([]);
  const [discount, setDiscount] = useState([]);
  const formik = useFormik({
    initialValues: {
      stock: "",
      bucket: 0,
      BranchId: userSelector.branchId,
      BookId: null,
      DiscountId: null,
    },
    validationSchema: Yup.object({
      stock: Yup.number().typeError("Isi dengan angka"),
      BookId: Yup.number().required("Required!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await api().patch(`/stock/v2/${id}`, values, {
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
    let res = await api().get(`/stock/${id}`, {
      // headers: {
      //   Authorization: token,
      // },
    });
    console.log(res);
    formik.setValues({
      ...formik.values,
      stock: res.data.stock,
      BookId: res.data.BookId,
      BranchId: res.data.BranchId,
    });
    let response = await api().get("/book/all");
    let response2 = await api().get(`/discount?place=${userSelector.branchId}`);
    setBook(response.data);
    // console.log(response2.data.Discount);
    setDiscount(response2.data.Discount);
  };
  useEffect(() => {
    getDataDetail();
  }, [getData, id]);
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
                {/* <Input
                  placeholder="Jumlah Stock"
                  name="stock"
                  value={formik.values.stock}
                  type="number"
                  onChange={(e) => {
                    formik.handleChange(e);
                    // const stock = parseInt(e.target.value);
                    formik.setFieldValue("stock", parseInt(e.target.value));
                  }}
                /> */}
                <Input
                  placeholder="Jumlah Stock"
                  name="stock"
                  type="number"
                  value={formik.values.stock}
                  // onChange={(e) => {
                  //   formik.handleChange(e);
                  //   const stock = parseInt(e.target.value);
                  //   formik.setFieldValue("stock", stock);
                  // }}
                  onChange={formik.handleChange}
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
              <Box>
                <FormLabel>Nama Diskon</FormLabel>
                <Select
                  placeholder="Select Book"
                  name="DiscountId"
                  onChange={(e) => {
                    formik.handleChange(e);
                    const discountID = parseInt(e.target.value);
                    formik.setFieldValue("DiscountId", discountID);
                  }}
                  value={formik.values.DiscountId}
                >
                  {discount.map((val, idx) => (
                    <option key={val.id} value={val.id}>
                      {val.title}
                    </option>
                  ))}
                </Select>
                {/* <Text color={"red.800"}>{formik.errors.BookId}</Text> */}
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
