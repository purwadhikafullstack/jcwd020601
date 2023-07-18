import { Box, Image, Text, Icon } from "@chakra-ui/react";
import logo from "../assets/images/gramedia-icon-2.png";
import { FaInstagram, FaSquareTwitter, FaFacebook } from "react-icons/fa6";
export default function NavbarFooter() {
	return (
		<Box
			display={"flex"}
			flexDirection={{ base: "column", md: "row" }}
			// bgColor={"blue.300"}
			boxShadow="0px -10px 25px skyblue"
			h={{ base: "12em", sm: "12em", md: "6em" }}
			justifyContent={"space-evenly"}
			alignItems={"center"}
			px="20px"
		>
			<Box>
				<Image src={logo} />
			</Box>
			<Box>
				<Text
					fontSize={{ base: "md", md: "xl", lg: "2xl" }}
					color={"grey"}
					textAlign={"center"}
					mx="20px"
				>
					Toko buku online terbesar, terlengkap dan terpercaya di Indonesia
				</Text>
			</Box>
			<Box display={"flex"} gap={"1em"}>
				<Box>
					<FaInstagram
						style={{
							color: "#e66465",
							fontSize: "2em",
						}}
					/>
				</Box>
				<Box>
					<FaSquareTwitter style={{ color: "skyblue", fontSize: "2em" }} />
				</Box>
				<Box>
					<FaFacebook
						style={{
							color: "blue",
							fontSize: "2em",
						}}
					/>
				</Box>
			</Box>
		</Box>
	);
}
