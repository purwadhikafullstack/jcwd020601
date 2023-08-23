import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { MdHistoryEdu } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import Edit from "./Edit";
import ModalStockHistory from "./ModalStockHistory";
import { api } from "../../../api/api";
import "../../../App.css";

export default function Action({ id, name, getData }) {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: editModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const {
    isOpen: historyModalOpen,
    onOpen: onHistoryModalOpen,
    onClose: onHistoryModalClose,
  } = useDisclosure();
  const deleteData = async () => {
    await api().delete(`/stock/v3/${id}`, {
      // headers: {
      //   Authorization: token,
      // },
    });
  };
  const handleClick = () => {
    Swal.fire({
      title: `Are you sure delete stock with name ${name}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData();
        Swal.fire("Deleted!", "Your data has been deleted.", "success");
        setTimeout(getData, 1000);
      }
    });
  };
  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<BsThreeDotsVertical />}
          variant="outline"
        />
        <MenuList>
          <MenuItem icon={<AiOutlineDelete />} onClick={handleClick}>
            Delete
          </MenuItem>

          <MenuItem
            icon={<FiEdit />}
            onClick={() => {
              onEditModalOpen();
            }}
          >
            <Edit
              isOpen={editModalOpen}
              onClose={onEditModalClose}
              id={id}
              getData={getData}
              // token={token}
            />
          </MenuItem>
          <MenuItem
            icon={<MdHistoryEdu />}
            onClick={() => {
              onHistoryModalOpen();
            }}
          >
            <ModalStockHistory
              isOpen={historyModalOpen}
              onClose={onHistoryModalClose}
              id={id}
              name={name}
            />
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
