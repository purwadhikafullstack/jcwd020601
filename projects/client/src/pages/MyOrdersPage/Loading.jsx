import { Center, Image } from "@chakra-ui/react";
import LoadingLogo from "../../assets/images/Loading-Gramedia.gif";

export default function Loading(props) {
  return (
    <Center>
      <Image w="100px" src={LoadingLogo}></Image>
    </Center>
  );
}
