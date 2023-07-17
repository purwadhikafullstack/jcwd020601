import {
	Box,
	Flex,
	Image,
	Menu,
	MenuButton,
	MenuList,
	Container,
	Icon,
	Collapse,
	Grid,
	GridItem,
	InputGroup,
	Input,
	InputRightElement,
	Avatar,
	Center,
	Text,
	useMediaQuery,
	useColorModeValue,
	IconButton,
	Stack,
	useDisclosure,
	Link,
} from "@chakra-ui/react";
import {
	HamburgerIcon,
	CloseIcon,
	ChevronDownIcon,
	ChevronRightIcon,
} from "@chakra-ui/icons";
import { BsChevronDown, BsCart } from "react-icons/bs";
import { GoSearch } from "react-icons/go";
import logo from "../assets/images/gramedia-icon-2.png";

}
const MobileNavItem = ({ label, children, href }) => {
	const { isOpen, onToggle } = useDisclosure();

	return (
		<Stack spacing={4} onClick={children && onToggle}>
			<Flex
				py={2}
				as={Link}
				href={href ?? "#"}
				justify={"space-between"}
				align={"center"}
				_hover={{
					textDecoration: "none",
				}}
			>
				<Text
					fontWeight={600}
					color={useColorModeValue("gray.600", "gray.200")}
				>
					{label}
				</Text>
				{children && (
					<Icon
						as={ChevronDownIcon}
						transform={isOpen ? "rotate(180deg)" : ""}
						w={6}
						h={6}
					/>
				)}
			</Flex>

			<Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
				<Stack
					borderStyle={"solid"}
					borderColor={useColorModeValue("gray.200", "gray.700")}
					align={"start"}
				>
					{children &&
						children.map((child) => (
							<Link key={child.label} py={2} href={child.href}>
								{child.label}
							</Link>
						))}
				</Stack>
			</Collapse>
		</Stack>
	);
};

const NAV_ITEMS = [
	{
		label: "Kategori",
		children: [
			{
				label: "Internasional",
				href: "#",
			},
			{
				label: "Novel",
				href: "#",
			},
			{
				label: "History",
				href: "#",
			},
			{
				label: "Comic",
				href: "#",
			},
			{
				label: "Self Improvement",
				href: "#",
			},
			{
				label: "Engineering",
				href: "#",
			},
		],
	},
	{
		label: "Keranjang",
		href: "#",
	},
	{
		label: "Masuk",
		href: "#",
	},
	{
		label: "Bantuan",
		href: "#",
	},
];
