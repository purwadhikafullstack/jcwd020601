import {
	Box,
	Flex,
	Card,
	CardBody,
	Stack,
	Heading,
	Text,
	CardFooter,
	Button,
	Image,
	ButtonGroup,
	Divider,
	useMediaQuery,
} from "@chakra-ui/react";
import Slider from "react-slick";

const item = [
	{
		pengarang: "J.S. Khairen",
		judul: "Melangkah",
		harga: "Rp 69.750",
		image:
			"https://cdn.gramedia.com/uploads/items/9786020523316_Melangkah_UV_Spot_R4-1__w150_hauto.jpg",
	},
	{
		pengarang: "Leila S. Chudori",
		judul: "Laut Bercerita",
		harga: " Rp 86.250",
		image:
			"https://cdn.gramedia.com/uploads/items/9786024246945_Laut-Bercerita__w150_hauto.png",
	},
	{
		pengarang: "Ono Eriko",
		judul: "Hai, Miiko! 34 - Premium (Bonus Cableholder)",
		harga: " Rp 45.000",
		image:
			"https://cdn.gramedia.com/uploads/items/WhatsApp_Image_2021-12-20_at_1.42.06_PM__w150_hauto.jpeg",
	},
	{
		pengarang: "Almira Bastari",
		judul: "Home Sweet Loan",
		harga: "Rp 74.250",
		image:
			"https://cdn.gramedia.com/uploads/items/Home_Sweet_Loan_cov__w150_hauto.jpg",
	},
	{
		pengarang: "Gege Akutami",
		judul: "Jujutsu Kaisen 05",
		harga: " Rp 36.000 ",
		image:
			"https://cdn.gramedia.com/uploads/items/9786230029783_Jujutsukaisen_5__w150_hauto.jpg",
	},
];
export default function BookCard() {
	// const [large] = useMediaQuery("(min-width: 980px)");
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

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
					Rekomendasi Gramedia
				</Text>
				<Text
					fontSize={{ base: "sm", xl: "xl" }}
					color={"blue.400"}
					cursor={"pointer"}
				>
					Lihat Semua
				</Text>
			</Box>
			<Box
				display={"flex"}
				gap={"25px"}
				// bgColor={"red"}
				flexWrap={"wrap"}
				justifyContent={"center"}
			>
				{item.map((val, idx) => (
					<Card key={idx}>
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
				{/* </Slider> */}
			</Box>
		</Flex>
	);
}
