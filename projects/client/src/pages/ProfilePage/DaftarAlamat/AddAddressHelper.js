import { api } from "../../../api/api";

async function submit({
  formikAddress,
  Swal,
  modalAddAddress,
  dispatch,
  nav,
  fetchUserAddresses,
}) {
  try {
    const token = JSON.parse(localStorage.getItem("auth"));
    await api
      .post("/address/v1?token=" + token, formikAddress.values)
      .then(async (res) => {
        modalAddAddress.onClose();
        formikAddress.resetForm();
        fetchUserAddresses();
        Swal.fire("Good job!", "Address Added", "success");
      });
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
