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
import Swal from "sweetalert2";
import icon from "../../../assets/images/icon.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "../../../api/api";
export default function Edit({ isOpen, onClose, id, getData, token }) {
  const IMG = process.env.REACT_APP_API_IMAGE_URL;
  const [scrollBehavior, setScrollBehavior] = useState("inside");
  const inputFileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState([]);
  const [image, setImage] = useState(icon);
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
      title: Yup.string().required("required!"),
      language: Yup.string().required("required!"),
      publish_date: Yup.number().required("required!number"),
      author: Yup.string().required("required!"),
      publisher: Yup.string().required("required!"),
      description: Yup.string().required("required!"),
      book_url: Yup.mixed()
        .required("required!")
        .test(
          "FILE_SIZE",
          "max allowed size is 1mb",
          (value) => value && value.size < 1024 * 1024
        )
        .test(
          "FILE_TYPE",
          "not a valid image type",
          (value) =>
            value &&
            ["image/png", "image/jpeg", "image/jpg"].includes(value.type)
        ),
      pages: Yup.number().required("required! number"),
      weight: Yup.string().required("required!"),
      dimension: Yup.string().required("required!"),
      price: Yup.number().required("required! number"),
      rating: Yup.string().required("required!"),
      CategoryId: Yup.number().required("Required!"),
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
      await api().patch(`/book/v2/${id}`, formData, {
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
    let res = await api().get(`/book/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    async function getImage(a) {
      let value = await fetch(a)
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], "image", { type: blob.type });
        });
      return value;
    }
    let imageData;
    getImage(IMG + res.data.value.book_url)
      .then((result) => {
        imageData = result;
        setSelectedFile(URL.createObjectURL(imageData));
        formik.setValues({
          ...formik.values,
          title: res.data.value.title,
          language: res.data.value.language,
          publish_date: new Date(res.data.value.publish_date).getFullYear(),
          author: res.data.value.author,
          publisher: res.data.value.publisher,
          description: res.data.value.description,
          book_url: imageData,
          pages: res.data.value.pages,
          weight: res.data.value.weight,
          dimension: res.data.value.dimension,
          price: res.data.value.price,
          rating: res.data.value.rating,
          CategoryId: res.data.value.CategoryId,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getCategory = async () => {
    let response = await api().get("/category/");
    setCategory(response.data.result);
  };
  useEffect(() => {
    getDataDetail();
    getCategory();
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
        <form onSubmit={formik.handleSubmit}>
          <ModalContent>
            <ModalHeader>Edit Buku</ModalHeader>
            <ModalCloseButton />
            <ModalBody gap={5} display={"flex"} flexDirection={"column"}>
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>Judul Buku</FormLabel>
                <Input
                  placeholder="Judul Buku"
                  name="title"
                  type="text"
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
                <Input
                  placeholder="Tahun terbit"
                  name="publish_date"
                  value={formik.values.publish_date}
                  onChange={formik.handleChange}
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
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormLabel>Deskripsi</FormLabel>
                <Textarea
                  placeholder="Deskripsi"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
                <Text color={"red.800"}>{formik.errors.description}</Text>
              </Box>
              <Box>
                <FormLabel>Pilih Category</FormLabel>
                <Select
                  placeholder="Category"
                  name="CategoryId"
                  onChange={(e) => {
                    formik.handleChange(e);
                    const CategoryId = parseInt(e.target.value);
                    formik.setFieldValue("CategoryId", CategoryId);
                  }}
                  value={formik.values.CategoryId}
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
                  src={selectedFile}
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
