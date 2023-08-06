import logo from "../../assets/images/gramedia-icon-2.png";
import {
  Box,
  Flex,
  Icon,
  useColorModeValue,
  // Link,
  Image,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const LinkItems = [
  { name: "Home", icon: FiHome },
  { name: "Product", icon: FiTrendingUp, link: "/admin/products" },
  { name: "Category", icon: FiCompass, link: "/Category" },
  { name: "Favourites", icon: FiStar },
  { name: "Settings", icon: FiSettings },
];

export default function Sidebar() {
  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.100", "gray.900")}
      zIndex={10}
    >
      <SidebarContent />
    </Box>
  );
}

const SidebarContent = () => {
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
        <Link to={link.link} key={link.name}>
          <NavItem icon={link.icon}>{link.name}</NavItem>
        </Link>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, href }) => {
  return (
    // <Link
    //   href={href}
    //   style={{ textDecoration: "none" }}
    //   _focus={{ boxShadow: "none" }}
    // >
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "cyan.400",
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
