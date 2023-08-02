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
	Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import "../../../App.css";
import { useEffect, useState, useRef } from "react";
import { api } from "../../../api/api";
export default function Edit({ isOpen, onClose, id, getData, token }) {
	const [scrollBehavior, setScrollBehavior] = useState("inside");
	const [disabled, setDisabled] = useState(true);
	const formik = useFormik({
		initialValues: {
			category: "",
		},
		enableReinitialze: true,
		validationSchema: Yup.object({
			category: Yup.string().required("required!").trim("Tidak boleh kosong"),
		}),
		onSubmit: async (values, { resetForm }) => {
			await api.patch(`/category/v2/${id}`, values, {
				headers: {
					Authorization: token,
				},
			});
			onClose();
			resetForm({ values: "" });
			Swal.fire("Good job!", "Your data has been Updated.", "success");
			setTimeout(getData, 1000);
			setDisabled(!disabled);
		},
	});
	const getDataDetail = async () => {
		let res = await api.get(`/category/${id}`);
		formik.setValues({ ...formik.values, category: res.data.category });
	};
	useEffect(() => {
		getDataDetail();
	}, [disabled]);
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
						<ModalBody gap={3} display={"flex"} flexDirection={"column"}>
							<FormLabel>Categori </FormLabel>
							<Input
								placeholder="Categori"
								name="category"
								type="text"
								value={formik.values.category}
								onChange={formik.handleChange}
								disabled={disabled}
							/>
							<Text color={"red.800"}>{formik.errors.category}</Text>
						</ModalBody>
						<ModalFooter>
							<Box display={"flex"}>
								<Box display={"flex"} gap={2} mt={5}>
									{disabled ? <></> : <Button type="submit">Submit</Button>}
									<Button
										colorScheme="blue"
										mr={3}
										onClick={() => {
											setDisabled(!disabled);
										}}
									>
										{disabled ? "Edit" : "Batal"}
									</Button>
								</Box>
							</Box>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
}
