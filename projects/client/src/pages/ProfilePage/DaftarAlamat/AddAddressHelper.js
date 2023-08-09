import { api } from "../../../api/api";

async function submit({
  Swal,
  modalAddAddress,
  dispatch,
  nav,
  fetchUserAddresses,
}) {
  try {
    modalAddAddress.onClose();
    fetchUserAddresses();
    Swal.fire("Good job!", "Address Added", "success");
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Login session has expired",
    });
    localStorage.removeItem("auth");
    localStorage.removeItem("address");
    localStorage.removeItem("Latitude");
    localStorage.removeItem("Longitude");
    dispatch({
      type: "logout",
    });
    nav("/login");
    modalAddAddress.onClose();
  }
}
const AddAddressHelpers = {
  submit,
};
export default AddAddressHelpers;
