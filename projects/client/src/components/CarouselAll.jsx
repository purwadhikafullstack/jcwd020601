import {
	Flex,
	Box,
	Card,
	CardBody,
	Image,
	Stack,
	Heading,
	Text,
	CardFooter,
	ButtonGroup,
	Button,
	Divider,
	useMediaQuery,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function CarouselAll() {
	const [large] = useMediaQuery("(min-width: 1280px)");
	let t = localStorage.getItem("auth");
	const [value, setValue] = useState([]);
	const [token, setToken] = useState(JSON.parse(t));
	const [limit, setLimit] = useState(4);
	const [keyword, setKeyword] = useState("");

	async function fetchProduct() {
		let response = await api.get(`/stock/Desc?limit=${limit}`);
		setValue(response.data.result);
	}
	useEffect(() => {
		fetchProduct();
	}, [token]);
	console.log(value);
	console.log(token);
	return (
		<Flex
			justify={"center"}
			flexDirection={"column"}
			alignItems={"center"}
			justifyContent={"center"}
			my={"40px"}
		>
			<Divider w={"75%"} />
			<Box
				display={"flex"}
				justifyContent={"space-between"}
				alignItems={"center"}
				w={{
					base: "340px",
					sm: "480px",
					md: "768px",
					lg: "992px",
					xl: "1280px",
				}}
				my={"10px"}
			>
				<Text
					fontSize={{ base: "lg", lg: "2xl", xl: "3xl" }}
					color={"blue.700"}
					fontWeight={{ base: "bold", md: "normal" }}
				>
					Buku - Buku Terpopuler
				</Text>
				<Text
					fontSize={{ base: "sm", xl: "xl" }}
					color={"blue.400"}
					cursor={"pointer"}
				>
					Lihat Semua
				</Text>
			</Box>
			<Box display={"flex"} gap={"25px"} justifyContent={"center"}>
				{large ? (
					<>
						<Box
							justifyContent={"center"}
							bgColor={"red"}
							h={"500px"}
							alignItems={"center"}
						>
							<Card>
								<Image
									src={
										"https://cdn.gramedia.com/uploads/category-list/Banner_Category_Gcom_-_April_2023_2_Novel_Terbaru_6xPgO1D__w204_hauto.png"
									}
									alt="Green double couch with wooden legs"
									borderRadius="lg"
									w={"250px"}
									h={"500px"}
								/>
							</Card>
						</Box>
					</>
				) : (
					<></>
				)}
				<Box
					display={"flex"}
					gap={"25px"}
					mb={"40px"}
					flexWrap={"wrap"}
					justifyContent={"center"}
				>
					{value.map((val, idx) => (
						<Card maxW="sm" key={idx}>
							<CardBody pb={0}>
								<Image
									src={val.Book?.book_url}
									alt="Green double couch with wooden legs"
									borderRadius="lg"
									w={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
									h={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
								/>
								<Stack mt="6" spacing="3">
									<Heading size="sm">{val.Book?.author}</Heading>
									<Text size={"sm"}>
										{val.Book?.title.length > 20
											? val.Book?.title.slice(0, 20) + "..."
											: val.Book?.title}
									</Text>
									<Text color="blue.600" fontSize="xl">
										Rp. {val.Book?.price}
									</Text>
								</Stack>
							</CardBody>
							<CardFooter>
								<ButtonGroup spacing="2" justifyContent={"center"}>
									<Button variant="solid" colorScheme="blue">
										Buy now
									</Button>
									<Button variant="ghost" colorScheme="blue">
										Add to cart
									</Button>
								</ButtonGroup>
							</CardFooter>
						</Card>
					))}
				</Box>
			</Box>

			<Divider w={"75%"} />
		</Flex>
	);
}
