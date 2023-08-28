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
    if (err.response.data.message == "token has expired") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
      localStorage.removeItem("auth");
      localStorage.removeItem("address");
      localStorage.removeItem("Latitude");
      localStorage.removeItem("Longitude");
      dispatch({
        type: "logout",
      });
      nav("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
    }
    modalAddAddress.onClose();
  }
}
const AddAddressHelpers = {
  submit,
};
export default AddAddressHelpers;
