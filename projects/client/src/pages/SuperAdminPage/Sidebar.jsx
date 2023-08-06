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
import { useNavigate } from "react-router-dom";
const LinkItems = [
  { name: "Home", icon: FiHome, link2: "Report" },
  { name: "Product", icon: FiTrendingUp, link: "/product" },
  { name: "Category", icon: FiCompass, link: "/category" },
  { name: "Favourites", icon: FiStar },
  { name: "Settings", icon: FiSettings },
  {
    name: "Branch-Admins",
    icon: AiOutlineUsergroupAdd,
    link2: "BranchAdmins",
  },
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
        <NavItem
          key={link.name}
          icon={link.icon}
          href={link.link ? link.link : ""}
          tab={props.tab}
          setTab={props.setTab}
          link2={link.link2}
          onClick={
            link.link2
              ? () => {
                  console.log("sadksadk");
                  props.setTab(link.link2);
                }
              : () => {
                  console.log("sadksadk");
                }
          }
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
            href ? nav(href) : setTab(link2);
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
