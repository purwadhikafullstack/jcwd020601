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

const item = [
	{
		pengarang: "Husna Widyani",
		judul: "60+ Dongeng Fabel Sepanjang Masa",
		harga: " Rp 78.400 ",
		image:
			"https://cdn.gramedia.com/uploads/items/9786020523835__w150_hauto.jpg",
	},
	{
		pengarang: "Morten",
		judul: "Great at Work",
		harga: " Rp 100.000",
		image:
			"https://cdn.gramedia.com/uploads/items/Cover_Great_At_Work_2022_page-0001__w150_hauto.jpg",
	},
	{
		pengarang: "Vita Wahid",
		judul: "Finding Ikigai in My Journey",
		harga: "  Rp 64.800 ",
		image:
			"https://cdn.gramedia.com/uploads/picture_meta/2023/4/5/ryfyia6xkccddzfirnusd7__w150_hauto.jpg",
	},
	{
		pengarang: "RATIH KUMALA",
		judul: "Saga dari Samudra",
		harga: " Rp 74.250 ",
		image:
			"https://cdn.gramedia.com/uploads/picture_meta/2023/5/17/la6bjhefmuksgptcjgggbi__w150_hauto.jpg",
	},
];

export default function CarouselAll() {
	const [large] = useMediaQuery("(min-width: 1280px)");
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
					{item.map((val, idx) => (
						<Card maxW="sm" key={idx}>
							<CardBody pb={0}>
								<Image
									src={val.image}
									alt="Green double couch with wooden legs"
									borderRadius="lg"
									w={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
									h={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
								/>
								<Stack mt="6" spacing="3">
									<Heading size="sm">{val.pengarang}</Heading>
									<Text size={"sm"}>
										{val.judul.length > 20
											? val.judul.slice(0, 20) + "..."
											: val.judul}
									</Text>
									<Text color="blue.600" fontSize="xl">
										{val.harga}
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
