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
export default function Edit({ isOpen, onClose, id, getData }) {
	const [scrollBehavior, setScrollBehavior] = useState("inside");
	const inputFileRef = useRef(null);
	const [SelectedFile, setSelectedFile] = useState(null);
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
			DiscountId: "",
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
			formData.append("DiscountId", values.DiscountId);
			await api.patch(`/book/v2/${id}`, formData);
			onClose();
			resetForm({ values: "" });
			Swal.fire("Good job!", "Your data has been Updated.", "success");
			setTimeout(getData, 1000);
		},
	});
	// console.log(isOpen);
	const getDataDetail = async () => {
		let res = await api.get(`/book/${id}`);
		formik.setValues({
			...formik.values,
			title: res.data.title,
			language: res.data.language,
			publish_date: res.data.publish_date,
			author: res.data.author,
			publisher: res.data.publisher,
			description: res.data.publisher,
			book_url: res.data.book_url,
			pages: res.data.pages,
			weight: res.data.weight,
			dimension: res.data.dimension,
			price: res.data.price,
			rating: res.data.rating,
			DiscountId: res.data.DiscountId,
		});
	};

	useEffect(() => {
		getDataDetail();
	}, [id]);
	console.log(formik.values.book_url);
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
						{/* {console.log(formik.values.book_url)} */}
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
									ref={inputFileRef}
									onClick={(e) => {
										formik.setFieldValue("book_url", e.target.files[0]);
										setImage(e.target.files[0]);
										setSelectedFile(URL.createObjectURL(e.target.files[0]));
									}}
								/>
								{formik.values.book_url && (
									<>
										<Image
											src={formik.values.book_url}
											w={"100px"}
											h={"100px"}
											onClick={() => {
												inputFileRef.current.click();
											}}
										/>
										<Text color={"red.800"}>{formik.errors.book_url}</Text>
									</>
								)}
							</Box>
						</ModalBody>
						<ModalFooter>
							<Box gap={5} display={"flex"} my={5}>
								<Button type="submit">Submit</Button>
								{/* <Button
									colorScheme="blue"
									mr={3}
									onClick={(e) => {
										onClose();
										// getData();
									}}
								>
									Close
								</Button> */}
							</Box>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
		</>
	);
}
