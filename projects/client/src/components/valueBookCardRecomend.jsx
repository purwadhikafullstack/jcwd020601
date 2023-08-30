import {
  Box,
  Flex,
  Card,
  CardBody,
  Text,
  CardFooter,
  Button,
  Image,
  ButtonGroup,
  useDisclosure,
} from "@chakra-ui/react";
import TooFarModal from "./TooFarModal";
import NoAddressModal from "./NoAddressModal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function ValueBookCardRecomend({ val, idx, add, percent }) {
  const IMG = process.env.REACT_APP_API_IMAGE_URL;
  const orderSelector = useSelector((state) => state.login.order);
  let t = localStorage.getItem("auth");
  const tooFarModal = useDisclosure();
  const noAddressModal = useDisclosure();
  return (
    <Link key={idx} to={`/products/detail/${val.id}`} cursor={"pointer"}>
      <Card
        w={{ base: "250px", sm: "250px", md: "250px", lg: "200px" }}
        h={{
          base: "550px",
          lg: "460px",
        }}
      >
        <CardBody>
          {val.Discount?.discount ? (
            <>
              {val.Discount?.isPercent ? (
                <>
                  <Box
                    w={14}
                    h={8}
                    position={"absolute"}
                    left={{
                      base: "195px",
                      md: "195px",
                      lg: "145px",
                    }}
                    borderTopRightRadius={"5px"}
                    top={"0px"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgColor={"blue.100"}
                  >
                    <Text color={"blue.900"}>-{val.Discount?.discount}%</Text>
                  </Box>
                </>
              ) : (
                <>
                  <Box
                    w={20}
                    h={8}
                    position={"absolute"}
                    left={{
                      base: "170px",
                      md: "170px",
                      lg: "122px",
                    }}
                    borderTopRightRadius={"5px"}
                    top={"0px"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgColor={"blue.100"}
                  >
                    <Text fontSize="md">
                      {/* - */}
                      {Intl.NumberFormat().format("-" + val.Discount?.discount)}
                    </Text>
                  </Box>
                </>
              )}
            </>
          ) : (
            <></>
          )}
          <Image
            src={IMG + val.Book?.book_url}
            alt="Green double couch with wooden legs"
            borderRadius="lg"
            w={{ base: "240px", sm: "220px", md: "200px", lg: "160px" }}
            h={{ base: "240px", sm: "220px", md: "200px", lg: "160px" }}
          />

          <Flex flexDir={"column"} my={5} gap={3}>
            <Text color="#4A5568" as={"i"}>
              {val.Book?.author.length > 15
                ? val.Book?.author.slice(0, 15) + "..."
                : val.Book?.author}
            </Text>
            <Text fontSize="lg">
              {val.Book?.title.length > 15
                ? val.Book?.title.slice(0, 15) + "..."
                : val.Book?.title}
            </Text>
            <Text color="blue.600" fontSize="md">
              {val.Discount?.discount ? (
                <>
                  {val.Discount?.isPercent ? (
                    <>
                      <Box gap={3} display={"flex"} flexDir={"column"}>
                        <Text
                          fontSize="md"
                          my={0}
                          as={"del"}
                          color={"blackAlpha.500"}
                        >
                          Rp.{Intl.NumberFormat().format(val.Book?.price)}
                        </Text>
                        <Text fontSize="xl">
                          Rp.
                          {Intl.NumberFormat().format(
                            val.Book?.price -
                              percent(val.Discount?.discount, val.Book?.price)
                          )}
                        </Text>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box gap={3} display={"flex"} flexDir={"column"}>
                        <Text
                          fontSize="md"
                          my={0}
                          as={"del"}
                          color={"blackAlpha.500"}
                        >
                          Rp. {Intl.NumberFormat().format(val.Book?.price)}
                        </Text>
                        <Text fontSize="xl">
                          Rp.{" "}
                          {Intl.NumberFormat().format(
                            val.Book?.price - val.Discount?.discount
                          )}
                        </Text>
                      </Box>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Text fontSize="xl">
                    Rp. {Intl.NumberFormat().format(val.Book?.price)}
                  </Text>
                </>
              )}
            </Text>
          </Flex>
        </CardBody>
        <CardFooter p={5}>
          <ButtonGroup spacing="2" justifyContent={"center"}>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={
                orderSelector.TooFar
                  ? () => tooFarModal.onOpen()
                  : orderSelector.AddressId
                  ? () => add(idx)
                  : () => noAddressModal.onOpen()
              }
            >
              Add to cart
            </Button>
          </ButtonGroup>
        </CardFooter>
        <TooFarModal tooFarModal={tooFarModal} />
        <NoAddressModal noAddressModal={noAddressModal} />
      </Card>
    </Link>
  );
}
