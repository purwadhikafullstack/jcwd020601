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
import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import "../../../App.css";
import { useSelector } from "react-redux";

export default function Add({ getData }) {
  const userSelector = useSelector((state) => state.login.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      BookId: Yup.number().required("Pilih buku"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await api().post("/stock/v1", values, {});
      onClose();
      resetForm({ values: "" });
      Swal.fire("Good job!", "Your data stock has been Added.", "success");
      setTimeout(getData, 1000);
    },
  });

  const fetchData = async () => {
    let response = await api().get("/book/all");
    let response2 = await api().get(`/discount?place=${userSelector.branchId}`);
    setBook(response.data);
    setDiscount(response2.data.Discount);
  };
  useEffect(() => {
    fetchData();
  }, [onOpen, onClose]);
  return (
    <>
      <Button
        onClick={onOpen}
        leftIcon={<GrFormAdd />}
        variant="outline"
        size={"lg"}
      >
        <Text display={{ base: "none", lg: "block" }}>Add Stock</Text>
      </Button>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={scrollBehavior}
        size={"xl"}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Tambah Stock</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={formik.handleSubmit}>
            <ModalBody gap={5} display={"flex"} flexDirection={"column"}>
              <Box>
                <FormLabel>Stock</FormLabel>
                <Input
                  placeholder="Jumlah Stock"
                  name="stock"
                  type="number"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                />
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
