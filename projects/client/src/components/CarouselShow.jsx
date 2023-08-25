import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Flex, Image, useMediaQuery } from "@chakra-ui/react";
import Slider from "react-slick";
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        zIndex: "1",
        marginRight: "30px",
      }}
      onClick={onClick}
    ></div>
  );
}
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        zIndex: "1",
        marginLeft: "30px",
      }}
      onClick={onClick}
    ></div>
  );
}
export default function CarouselShow() {
  const [large] = useMediaQuery("(min-width: 1280px)");
  const image = [
    "https://cdn.gramedia.com/uploads/marketing/Detak_Cerita_Juni_-_Puisi_Storefront_uQT76FJ__wauto_h336.png",
    "https://cdn.gramedia.com/uploads/marketing/SPILL_-_Sale_Paling_Gokill_Storefront_QfoNZwG__wauto_h336.png",
    "https://cdn.gramedia.com/uploads/marketing/Special_Offer_Monster_Vol._01_Storefront__wauto_h336.jpg",
  ];
  const image2 = [
    "https://cdn.gramedia.com/uploads/marketing/Pre_Order_Majalah_Bobo_Edisi_Koleksi_Terbatas_50_Tahun_Twitter__wauto_h164.png",
    "https://cdn.gramedia.com/uploads/marketing/Buku_Paling_Diburu_Juli_2023_Storefront_jiaV6UT__wauto_h164.jpg",
  ];
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 50000,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div style={{ marginBottom: "40px" }}>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"center"}
        mt={"50px"}
        mb={"50px"}
        gap={"10px"}
      >
        <Box
          w={{ base: "30em", sm: "30em", md: "48em", lg: "62em" }}
          h={{ base: "15em", sm: "20em", md: "30em" }}
          borderRadius="10px"
          position={"relative"}
          zIndex={1}
        >
          <Slider {...settings}>
            {image.map((url, index) => (
              <Box
                key={index}
                position="relative"
                backgroundPosition="center"
                backgroundSize="cover"
                borderRadius="10px"
                objectFit={"contain"}
                // bgColor={"red"}
              >
                <Image
                  src={url}
                  objectFit={"cover"}
                  w={{ base: "30em", sm: "30em", md: "48em", lg: "62em" }}
                  h={{ base: "15em", sm: "20em", md: "30em" }}
                  borderRadius={"10px"}
                />
              </Box>
            ))}
          </Slider>
        </Box>
        {large ? (
          <>
            <Box
              display={"flex"}
              flexDirection={"column"}
              w={"30em"}
              h={"30em"}
              borderRadius={"10px"}
              gap={"10px"}
            >
              {image2.map((url, index) => (
                <Box
                  key={index}
                  h={"15em"}
                  w={"30em"}
                  backgroundPosition="center"
                  backgroundRepeat="no-repeat"
                  backgroundSize="cover"
                  backgroundImage={`url('${url}')`}
                  borderRadius="10px"
                ></Box>
              ))}
            </Box>
          </>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}
