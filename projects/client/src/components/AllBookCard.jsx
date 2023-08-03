import {
  Box,
  Center,
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link } from "react-router-dom";
export default function AllBookCard() {
  let t = localStorage.getItem("auth");
  const [value, setValue] = useState([]);
  const [token, setToken] = useState(JSON.parse(t));
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");

  async function fetchProduct() {
    let response = await api.get(`/stock?limit=${limit}`);
    setValue(response.data.result);
  }
  useEffect(() => {
    fetchProduct();
  }, [token]);
  return (
    <>
      <Center>
        <Box
          // bgColor={"red"}
          maxWidth={"1100px"}
          display={"flex"}
          gap={3}
          p={3}
          flexWrap={"wrap"}
          my={10}
        >
          {value.map((val, idx) => (
            <Link to={`/detailBook/${val.id}`} cursor={"pointer"}>
              <Card
                key={idx}
                w={{ base: "250px", sm: "250px", md: "250px", lg: "200px" }}
              >
                <CardBody pb={0}>
                  <Image
                    src={val.Book?.book_url}
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                    w={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
                    h={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="sm">{val.Book?.author}</Heading>
                    <Text size={"sm"}>
                      {val.Book?.title.length > 20
                        ? val.Book?.title.slice(0, 20) + "..."
                        : val.Book?.title}
                    </Text>
                    <Text color="blue.600" fontSize="xl">
                      Rp. {val.Book?.price}
                    </Text>
                  </Stack>
                </CardBody>
                <CardFooter>
                  {/* <ButtonGroup spacing="2" justifyContent={"center"}>
									<Button variant="solid" colorScheme="blue">
										Buy now
									</Button>
									<Button variant="ghost" colorScheme="blue">
										Add to cart
									</Button>
								</ButtonGroup> */}
                </CardFooter>
              </Card>
            </Link>
          ))}
          {value.map((val, idx) => (
            <Link to={`/detailBook/${val.id}`} cursor={"pointer"}>
              <Card
                key={idx}
                w={{ base: "250px", sm: "250px", md: "250px", lg: "200px" }}
              >
                <CardBody pb={0}>
                  <Image
                    src={val.Book?.book_url}
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                    w={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
                    h={{ base: "300px", sm: "280px", md: "260px", lg: "220px" }}
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="sm">{val.Book?.author}</Heading>
                    <Text size={"sm"}>
                      {val.Book?.title.length > 20
                        ? val.Book?.title.slice(0, 20) + "..."
                        : val.Book?.title}
                    </Text>
                    <Text color="blue.600" fontSize="xl">
                      Rp. {val.Book?.price}
                    </Text>
                  </Stack>
                </CardBody>
                <CardFooter>
                  {/* <ButtonGroup spacing="2" justifyContent={"center"}>
									<Button variant="solid" colorScheme="blue">
										Buy now
									</Button>
									<Button variant="ghost" colorScheme="blue">
										Add to cart
									</Button>
								</ButtonGroup> */}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </Box>
      </Center>
    </>
  );
}
