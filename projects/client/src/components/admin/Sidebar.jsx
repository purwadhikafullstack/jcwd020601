import logo from "../../assets/images/gramedia-icon-2.png";
import {
  Box,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Image,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
} from "react-icons/fi";

import { GrTransaction } from "react-icons/gr";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LinkItems = [
  { name: "Home", icon: FiHome, address: "/admin" },
  { name: "Product", icon: FiTrendingUp, address: "/admin/product" },
  { name: "Category", icon: FiCompass, address: "/admin/category" },
  { name: "Transaction", icon: GrTransaction, address: "/admin/order" },
  { name: "Favourites", icon: FiStar, address: "/favorites" },
  { name: "Settings", icon: FiSettings, address: "/settings" },
];

export default function Sidebar() {
  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.100", "gray.900")}
      zIndex={10}
    >
      <SidebarContent LinkItems={LinkItems} />
    </Box>
  );
}

const SidebarContent = ({ LinkItems }) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={60}
      pos="sticky"
      h="full"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src={logo} w={{ base: "10em", sm: "12em" }} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem icon={link.icon} key={link.name}>
          <Link to={link.address}>
            {link.name}
            {/* {link.address}{" "} */}
          </Link>
          {/* asdasd */}
        </NavItem>
        // {/* </Link> */}
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, address }) => {
  // const nav = useNavigate();
  return (
    // <Link
    //   to={address}
    // style={{ textDecoration: "none" }}
    // _focus={{ boxShadow: "none" }}
    // bgColor={"red"}
    // >
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "#2c5282",
        color: "white",
      }}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: "white",
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
    // </Link>
  );
};
