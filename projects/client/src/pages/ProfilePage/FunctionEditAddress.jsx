import { useToast } from "@chakra-ui/react";
import { api } from "../../api/api";

export async function fetchUserAddresses({ val, setUserAddresses, toast }) {
  try {
    console.log("askasjf");
    await api
      .get("/address/user/" + val.userSelector.id)
      .then((res) => {
        setUserAddresses(res.data);
      })
      .catch((err) => {
        toast({
          position: "top",
          title: "Something went wrong",
          description: err.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  } catch (err) {
    alert(err.data.message);
  }
}
