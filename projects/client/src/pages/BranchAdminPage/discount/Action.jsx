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
import { FiEdit } from "react-icons/fi";
import { api } from "../../../api/api";
import "../../../App.css";
import Edit from "./Edit";

export default function Action({ id, name, getData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteData = async () => {
    await api().delete(`/discount/v3/${id}`, {});
  };
  const handleClick = () => {
    Swal.fire({
      title: `Are you sure delete discount with name ${name}?`,
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
              onOpen();
            }}
          >
            <Edit isOpen={isOpen} onClose={onClose} id={id} getData={getData} />
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
