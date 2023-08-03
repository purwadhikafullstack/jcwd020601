import Navbar from "../components/Navbar";
import NavbarFooter from "../components/NavbarFooter";
import DetailBook from "../components/DetailBook";
import BookCardRecomend from "../components/BookCardRecomend";

export default function DetailBookPage() {
  return (
    <>
      <Navbar />
      <DetailBook />
      <BookCardRecomend />
      <NavbarFooter />
    </>
  );
}
