import { Flex, Box, Image, Text, Center } from "@chakra-ui/react";

const item = [
	{
		name: "Buku Baru Andalan",
		icon: "https://cdn.gramedia.com/uploads/highlighted_menu/Icon_category_Buku_Baru__w100_hauto.png",
	},
	{
		name: "Buku Pilihan",
		icon: "https://cdn.gramedia.com/uploads/highlighted_menu/Icon_category_Buku_Pilihan__w100_hauto.png",
	},
	{
		name: "Internasional Books",
		icon: "https://cdn.gramedia.com/uploads/highlighted_menu/Icon_category_Buku_Import__w100_hauto.png",
	},
	{
		name: "E-book dan Paket Premium",
		icon: "https://cdn.gramedia.com/uploads/highlighted_menu/Icon_category_ebook__w100_hauto.png",
	},
	{
		name: "Gramedia Academy",
		icon: "https://cdn.gramedia.com/uploads/highlighted_menu/Icon_category_Voucher_Gramedia_Academy_2__w100_hauto.png",
	},
	{
		name: "Print On Demand",
		icon: "https://cdn.gramedia.com/uploads/highlighted_menu/Icon_category_Print_on_Demand__w100_hauto.png",
	},
	{
		name: "Non Books",
		icon: "https://cdn.gramedia.com/uploads/highlighted_menu/Icon_category_Alat_Tulis_XWRKmAp__w100_hauto.png",
	},
];

export default function CarouselBooks() {
	return (
		<Flex justifyContent={"center"} gap={"10px"} flexWrap={"wrap"}>
			{item.map((val, idx) => (
				<Box
					display={"flex"}
					flexDirection={"column"}
					alignItems={"center"}
					gap={"20px"}
					key={idx}
					w={{ base: "120px", sm: "140px", md: "160px", lg: "200px" }}
					h={{ base: "160px" }}
				>
					<Image src={val.icon} objectFit={"cover"} />
					<Text textAlign={"center"} fontWeight={"bold"} color="blue.700">
						{val.name}
					</Text>
				</Box>
			))}
		</Flex>
	);
}
