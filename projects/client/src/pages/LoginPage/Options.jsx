import { Box, Center, Flex } from "@chakra-ui/react";

export default function Options() {
  return (
    <Center
      flexWrap={"wrap"}
      className="loginpage-about"
      display={"flex"}
      color={"blackAlpha.700"}
      px={"10px"}
      gap={"20px"}
    >
      <Box fontSize={"13px"} cursor={"pointer"}>
        Meta
      </Box>{" "}
      <Box fontSize={"13px"} cursor={"pointer"}>
        About
      </Box>
      <Box fontSize={"13px"} cursor={"pointer"}>
        Blog
      </Box>
      <Flex fontSize={"13px"} cursor={"pointer"}>
        Jobs
      </Flex>
      <Flex fontSize={"13px"} cursor={"pointer"}>
        Help
      </Flex>
      <Flex fontSize={"13px"} cursor={"pointer"}>
        API
      </Flex>
      <Flex fontSize={"13px"} cursor={"pointer"}>
        Privacy
      </Flex>
      <Flex fontSize={"13px"} cursor={"pointer"}>
        Terms
      </Flex>
      <Flex fontSize={"13px"} cursor={"pointer"}>
        Top Accounts
      </Flex>
      <Flex fontSize={"13px"} cursor={"pointer"}>
        Locations
      </Flex>
      <Flex fontSize={"13px"} cursor={"pointer"}>
        Gramedia Lite
      </Flex>
      <Flex fontSize={"13px"} cursor={"pointer"}>
        Contact Uploading & Non-Users
      </Flex>
      <Flex fontSize={"13px"} cursor={"pointer"}>
        Meta Verified
      </Flex>
    </Center>
  );
}
