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
  NumberInput,
  ModalCloseButton,
  NumberInputField,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import "../../../../App.css";
import { GrFormAdd } from "react-icons/gr";
import { useEffect, useState } from "react";
import { api } from "../../../../api/api";

export default function Add({ getData }) {
  // export default function Stock
  // { getData, token }
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = useState("inside");
  const [book, setBook] = useState([]);
  const formik = useFormik({
    initialValues: {
      stock: null,
      BookId: null,
      BranchId: 2,
    },
    validationSchema: Yup.object({
      stock: Yup.string()
        .trim()
        .typeError("Isi dengan angka")
        .required("Isi dalam bentuk angka & tidak boleh kosong"),
      BookId: Yup.number().required("Required!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await api.post("/stock/v1", values, {
        // headers: {
        //   Authorization: token,
        // },
      });
      onClose();
      resetForm({ values: "" });
      Swal.fire("Good job!", "Your data stock has been Added.", "success");
      setTimeout(getData, 1000);
    },
  });

  const fetchData = async () => {
    let response = await api.get("/book/all");
    setBook(response.data);
    // console.log(response);
  };
  useEffect(() => {
    fetchData();
  }, [isOpen, onOpen, onClose]);
  // console.log(formik.values);
  // console.log(book);
  return (
    <>
      <Button onClick={onOpen} leftIcon={<GrFormAdd />} variant="outline">
        Add Stock
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
                <NumberInput max={50} min={10}>
                  <NumberInputField
                    placeholder="Jumlah Stock"
                    name="stock"
                    min={1}
                    value={formik.values.stock}
                    onChange={(e) => {
                      formik.handleChange(e);
                      const stock = parseInt(e.target.value);
                      formik.setFieldValue("stock", stock);
                    }}
                  />
                </NumberInput>
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
