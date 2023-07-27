import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
	Box,
	Input,
	Button,
} from "@chakra-ui/react";

import { api } from "../../api/api";

import ReactPaginate from "react-paginate";
import "../../App.css";
import { BiSearchAlt } from "react-icons/bi";
import { GrPowerReset } from "react-icons/gr";
import { useEffect, useState } from "react";
import Add from "./category/Add";
import Action from "./category/Action";
export default function Category() {
	const [value, setValue] = useState([]);
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(10);
	const [rows, setRows] = useState(0);
	const [pages, setPages] = useState(0);
	const [keyword, setKeyword] = useState("");
	const [query, setQuery] = useState("");

	async function fetchCategori() {
		let response = await api.get(
			`/category?search_query=${keyword}&page=${page}&limit=${limit}`
		);
		setValue(response.data.result);
		setPage(response.data.page);
		setRows(response.data.totalRows);
		setPages(response.data.totalPage);
	}
	const inputSearch = (e) => {
		setQuery(e.target.value);
	};
	const changePage = ({ selected }) => {
		setPage(selected);
	};

	const searchData = () => {
		setPage(0);
		setKeyword(query);
	};
	useEffect(() => {
		fetchCategori();
	}, [page, keyword]);

	const resetKeyWord = () => {
		setKeyword("");
		fetchCategori();
		setQuery("");
	};
	console.log(query);
	return (
		<>
			<Box marginLeft={60}>
				<TableContainer padding={10}>
					<Box
						display={"flex"}
						alignItems={"center"}
						justifyContent={"space-between"}
						px={5}
					>
						<Box display={"flex"} py={3} gap={3}>
							<Input
								placeholder="Basic Usage"
								variant={"outline"}
								w={"30em"}
								size="lg"
								onChange={inputSearch}
								value={query}
							/>
							<Button
								leftIcon={<BiSearchAlt />}
								onClick={searchData}
								variant="outline"
								size={"lg"}
							>
								Search
							</Button>
							<Button
								leftIcon={<GrPowerReset />}
								onClick={resetKeyWord}
								variant="outline"
								size={"lg"}
							>
								Reset
							</Button>
						</Box>
						<Add getData={fetchCategori} />
					</Box>
					<Table variant="simple">
						<TableCaption my={5}>
							Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
						</TableCaption>
						<Thead>
							<Tr>
								<Th fontSize={18}>No</Th>
								<Th fontSize={18}>Categori</Th>
								<Th fontSize={18}></Th>
							</Tr>
						</Thead>
						<Tbody>
							{value.map((val, idx) => (
								<Tr key={val.id}>
									<Td>{idx + 1}</Td>
									<Td>{val.category}</Td>
									<Td>
										<Action
											id={val.id}
											name={val.category}
											getData={fetchCategori}
										/>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
					<ReactPaginate
						previousLabel={"< Prev"}
						nextLabel={"Next >"}
						pageCount={pages}
						onPageChange={changePage}
						breakLabel="..."
						containerClassName="pagination"
						pageLinkClassName="page-num"
						renderOnZeroPageCount={null}
						previousLinkClassName="page-num"
						nextLinkClassName="page-num"
						activeLinkClassName="active"
						pageRangeDisplayed={3}
					/>{" "}
				</TableContainer>
			</Box>
		</>
	);
}
