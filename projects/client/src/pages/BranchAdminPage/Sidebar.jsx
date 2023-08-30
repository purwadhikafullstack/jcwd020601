import { useState } from "react";
import logo from "../../assets/images/gramedia-icon-2.png";
import {
  Box,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Image,
} from "@chakra-ui/react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
} from "react-icons/fi";
import { TbDiscount } from "react-icons/tb";
import { BiArchiveIn } from "react-icons/bi";
import { GrTransaction } from "react-icons/gr";

import { useNavigate } from "react-router-dom";
const LinkItems = [
  { name: "Home", icon: FiHome, link: "/admin/" },
  { name: "Stock", icon: BiArchiveIn, link: "/admin/stock" },
  { name: "Discount", icon: TbDiscount, link: "/admin/discount" },
  { name: "Transaction", icon: GrTransaction, link: "/admin/order" },
];

export default function Sidebar(props) {
  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.100", "gray.900")}
      zIndex={10}
    >
      <SidebarContent setTab={props.setTab} tab={props.tab} />
    </Box>
  );
}

const SidebarContent = (props) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      display={{ base: "none", lg: "block" }}
      // bgColor={"red.100"}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={60}
      position={"fixed"}
      zIndex={100}
      h="100vh"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src={logo} w={{ base: "10em", sm: "12em" }} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          href={link.link ? link.link : ""}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, href, setTab, tab, link2 }) => {
  const nav = useNavigate();
  return (
    <Link style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        onClick={() => {
          {
            nav(href);
          }
        }}
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
            fontSize="20px"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};
