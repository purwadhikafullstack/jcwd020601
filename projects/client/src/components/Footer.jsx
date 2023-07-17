import { Box, Text, ListItem, List, Highlight, Image } from "@chakra-ui/react";
import android from "../assets/images/play-store.png";
import ios from "../assets/images/app-store.png";
export default function Footer() {
	return (
		<Box
			display={"flex"}
			justifyContent={"center"}
			alignItems={"center"}
			my={{ base: "10px" }}
			flexWrap={"wrap"}
		>
			<Box
				w={"18em"}
				h={{ base: "10em", sm: "10em", md: "18em" }}
				display={"flex"}
				flexDirection={"column"}
			>
				<Text color="blue.600" py={"20px"} fontSize="2xl" fontWeight={"bold"}>
					Product Gramedia
				</Text>
				<List spacing={5}>
					<ListItem fontWeight={"bold"} color={"grey"} fontSize={"lg"}>
						Gramedia Affilate
					</ListItem>
					<ListItem fontWeight={"bold"} color={"grey"} fontSize={"lg"}>
						Mitra Gramedia
					</ListItem>
				</List>
			</Box>
			<Box
				w={"18em"}
				h={{ base: "12em", sm: "12em", md: "18em" }}
				display={"flex"}
				flexDirection={"column"}
			>
				<Text color="blue.600" py={"20px"} fontSize="2xl" fontWeight={"bold"}>
					Belanja
				</Text>
				<List spacing={5}>
					<ListItem fontWeight={"bold"} color={"grey"} fontSize={"lg"}>
						Berbelanja
					</ListItem>
					<ListItem fontWeight={"bold"} color={"grey"} fontSize={"lg"}>
						Pembayaran
					</ListItem>
					<ListItem fontWeight={"bold"} color={"grey"} fontSize={"lg"}>
						Pengiriman
					</ListItem>
				</List>
			</Box>
			<Box
				w={"18em"}
				h={{ base: "12em", sm: "12em", md: "18em" }}
				display={"flex"}
				flexDirection={"column"}
			>
				<Text color="blue.600" fontSize="2xl" py={"20px"} fontWeight={"bold"}>
					Tentang Gramedia
				</Text>
				<List spacing={5}>
					<ListItem fontWeight={"bold"} color={"grey"} fontSize={"lg"}>
						Tentang Kami
					</ListItem>
					<ListItem fontWeight={"bold"} color={"grey"} fontSize={"lg"}>
						Toko Kami
					</ListItem>
					<ListItem fontWeight={"bold"} color={"grey"} fontSize={"lg"}>
						Kerjasama
					</ListItem>
				</List>
			</Box>
			<Box
				w={"18em"}
				h={{ base: "15em", sm: "15em", md: "18em" }}
				display={"flex"}
				flexDirection={"column"}
			>
				<Text color="blue.600" fontSize="2xl" py={"20px"} fontWeight={"bold"}>
					Lainnya
				</Text>
				<List spacing={5}>
					<ListItem fontWeight={"bold"} color={"grey"} fontSize={"lg"}>
						Syarat & Ketentuan
					</ListItem>
					<ListItem fontWeight={"bold"} color={"grey"} fontSize={"lg"}>
						Kebijakan & Privasi
					</ListItem>
					<ListItem fontWeight={"bold"} color={"grey"} fontSize={"lg"}>
						Bantuan
					</ListItem>
					<ListItem fontWeight={"bold"} color={"grey"} fontSize={"lg"}>
						Hubungi Kami
					</ListItem>
				</List>
			</Box>
			<Box w={"18em"} h={"18em"} display={"flex"} flexDirection={"column"}>
				<Text color="blue.600" fontSize="2xl" py={"20px"} fontWeight={"bold"}>
					Aplikasi Seluler Kami
				</Text>
				<Text
					fontWeight={"bold"}
					color={"grey"}
					fontSize={"md"}
					textAlign={"justify"}
				>
					Download aplikasi{" "}
					<Highlight
						query="Gramedia.com"
						styles={{ px: "2", py: "1", rounded: "full", bg: "blue.100" }}
					>
						Gramedia.com
					</Highlight>{" "}
					yang tersedia di seluruh perangkat iOS dan Android
				</Text>
				<Box display={"flex"} gap={"10px"} pt={"20px"}>
					<Box>
						<Image src={android} w={"120px"} />
					</Box>
					<Box>
						<Image src={ios} w={"120px"} />
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
