import {
  Box,
  Image,
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormLabel,
  Textarea,
  Select,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import "../../../App.css";
import { GrFormAdd, GrPowerReset } from "react-icons/gr";
import Swal from "sweetalert2";
import icon from "../../../assets/images/icon.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "../../../api/api";

export default function Add({ getData }) {
  let t = localStorage.getItem("auth");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = useState("inside");
  const inputFileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState(icon);
  const [category, setCategory] = useState([]);
  const [token, setToken] = useState(JSON.parse(t));
  const formik = useFormik({
    initialValues: {
      title: "",
      language: "",
      publish_date: "",
      author: "",
      publisher: "",
      description: "",
      book_url: "",
      pages: "",
      weight: "",
      dimension: "",
      price: "",
      rating: "",
      CategoryId: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Tidak Boleh Kosong!"),
      language: Yup.string().required("Tidak Boleh Kosong!"),
      publish_date: Yup.string().required("Tidak Boleh Kosong!"),
      author: Yup.string().required("Tidak Boleh Kosong!"),
      publisher: Yup.string().required("Tidak Boleh Kosong!"),
      description: Yup.string().required("Tidak Boleh Kosong!"),
      book_url: Yup.mixed()
        .required("Tidak Boleh Kosong!")
        .test(
          "Ukuran File",
          "Maksimal 1 Mb",
          (value) => value && value.size < 1024 * 1024
        )
        .test(
          "Type File",
          "File bukan type gambar",
          (value) =>
            value &&
            ["image/png", "image/jpeg", "image/jpg"].includes(value.type)
        ),
      pages: Yup.number().required("Tidak Boleh Kosong!"),
      weight: Yup.string().required("Tidak Boleh Kosong!"),
      dimension: Yup.string().required("Tidak Boleh Kosong!"),
      price: Yup.number().required("Tidak Boleh Kosong!"),
      rating: Yup.string().required("Tidak Boleh Kosong!"),
      CategoryId: Yup.number()
        .required("Tidak Boleh Kosong!")
        .typeError("Category Tidak Boleh Kosong"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("book_url", values.book_url);
      formData.append("title", values.title);
      formData.append("language", values.language);
      formData.append("publish_date", values.publish_date);
      formData.append("author", values.author);
      formData.append("publisher", values.publisher);
      formData.append("description", values.description);
      formData.append("pages", values.pages);
      formData.append("weight", values.weight);
      formData.append("dimension", values.dimension);
      formData.append("price", values.price);
      formData.append("rating", values.rating);
      formData.append("CategoryId", values.CategoryId);
      await api().post("/book/v1", formData, {
        headers: {
          Authorization: token,
        },
      });
      onClose();
      resetForm({ values: "" });
      setSelectedFile(null);
      setImage(icon);
      Swal.fire("Good job!", "Your data has been Added.", "success");
      setTimeout(getData, 1000);
    },
  });
  const fetchCategory = async () => {
    let response = await api().get("/category");
    setCategory(response.data.result);
  };

  useEffect(() => {
    fetchCategory();
  }, [token]);
  return (
    <>
      <Button
        onClick={onOpen}
        leftIcon={<GrFormAdd />}
        variant="outline"
        size={"lg"}
      >
        <Text display={{ base: "none", lg: "block" }}>Add Data</Text>
        {/* Add Data */}
      </Button>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={scrollBehavior}
        size={"xl"}
      >
        <ModalOverlay />
        <form onSubmit={formik.handleSubmit}>
          <ModalContent>
            <ModalHeader>Tambah Buku</ModalHeader>
            <ModalCloseButton />
            <ModalBody gap={5} display={"flex"} flexDirection={"column"}>
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>Judul Buku</FormLabel>
                <Input
                  placeholder="Judul Buku"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.title}</Text>
              </Box>

              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>Bahasa</FormLabel>
                <Input
                  placeholder="Bahasa"
                  name="language"
                  value={formik.values.language}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.language}</Text>
              </Box>

              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>Penerbit</FormLabel>
                <Input
                  placeholder="Penerbit"
                  name="publisher"
                  value={formik.values.publisher}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.publisher}</Text>
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>Penulis</FormLabel>
                <Input
                  placeholder="Penulis"
                  name="author"
                  value={formik.values.author}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.author}</Text>
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>Harga</FormLabel>
                <Input
                  placeholder="Harga"
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.price}</Text>
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>Lembar Halaman</FormLabel>
                <Input
                  placeholder="Lembar Halaman"
                  name="pages"
                  value={formik.values.pages}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.pages}</Text>
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>Tahun Terbit</FormLabel>
                <input
                  placeholder="Tahun terbit"
                  name="publish_date"
                  value={formik.values.publish_date}
                  onChange={formik.handleChange}
                  type="date"
                />
                <Text color={"red.800"}>{formik.errors.publish_date}</Text>
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>Berat</FormLabel>
                <Input
                  placeholder="Berat"
                  name="weight"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.weight}</Text>
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>DimensiPanjang&Lebar</FormLabel>
                <Input
                  placeholder="DimensiPanjang&Lebar"
                  name="dimension"
                  value={formik.values.dimension}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.dimension}</Text>
              </Box>
              <Box>
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder="Select Category"
                  name="CategoryId"
                  onChange={(e) => {
                    formik.handleChange(e);
                    const categoryId = parseInt(e.target.value);
                    formik.setFieldValue("CategoryId", categoryId);
                  }}
                >
                  {category.map((val, idx) => (
                    <option key={val.id} value={val.id}>
                      {val.category}
                    </option>
                  ))}
                </Select>
                <Text color={"red.800"}>{formik.errors.CategoryId}</Text>
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                {" "}
                <FormLabel>Deskripsi</FormLabel>
                <Textarea
                  placeholder="Deskripsi"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.description}</Text>
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>Rating</FormLabel>
                <Input
                  placeholder="Rating"
                  name="rating"
                  value={formik.values.rating}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.rating}</Text>
              </Box>

              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>Gambar</FormLabel>
                <Input
                  type="file"
                  name="book_url"
                  display="none"
                  ref={inputFileRef}
                  onChange={(e) => {
                    formik.setFieldValue("book_url", e.target.files[0]);
                    setImage(e.target.files[0]);
                    setSelectedFile(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                <Image
                  src={selectedFile ? selectedFile : image}
                  w={"100px"}
                  h={"100px"}
                  onClick={() => {
                    inputFileRef.current.click();
                  }}
                />
                <Text color={"red.800"}>{formik.errors.book_url}</Text>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Box gap={5} display={"flex"} my={5}>
                <Button type="submit">Submit</Button>
              </Box>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
