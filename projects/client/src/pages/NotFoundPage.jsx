import { Box, Center } from "@chakra-ui/react";

export default function NotFoundPage(props) {
  return (
    <>
      <Box
        display={"flex"}
        flexDir={"column"}
        justifyContent={"center"}
        h={"80vh"}
      >
        <Center fontSize={"3.5rem"} color={"#385898"} fontWeight={"700"}>
          ERROR
        </Center>
        <Center fontSize={"2.5rem"} fontWeight={"500"}>
          404 NOT FOUND
        </Center>
      </Box>
    </>
  );
}
