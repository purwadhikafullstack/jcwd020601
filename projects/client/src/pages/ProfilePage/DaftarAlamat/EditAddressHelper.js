import * as Yup from "yup";
import YupPassword from "yup-password";
import { api } from "../../../api/api";
YupPassword(Yup);
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const validationSchemaAddress = Yup.object().shape({
  no_Handphone: Yup.string()
    .trim()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("You need to enter a phone number"),
  namaPenerima: Yup.string()
    .required("You need to enter a receiver's name")
    .trim(),
  labelAlamat: Yup.string()
    .required("You need to enter your address labels")
    .trim(),
  province: Yup.string().trim().required("You need to enter your province"),
  city: Yup.string().trim().required("You need to enter your city"),
  pos: Yup.string().trim().required("You need to enter your poscode"),
  alamatLengkap: Yup.string()
    .trim()
    .required("You need to enter your complete address"),
});
async function submit({ val, token, Swal, dispatch, formikAddress }) {
  await api
    .patch(
      "/address/v2/" + val.addressUser.id + "?token=" + token,
      formikAddress.values
    )
    .then(async (res) => {
      await val.fetchUserAddresses();
      Swal.fire("Good job!", "Address Changed", "success");
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
      });
      localStorage.removeItem("auth");
      localStorage.removeItem("address");
      localStorage.removeItem("Latitude");
      localStorage.removeItem("Longitude");
      dispatch({
        type: "logout",
      });
      val.nav("/login");
    });
}

async function delAddress({ val, token, dispatch, Swal, modalEditAddress }) {
  try {
    await api
      .post("address/v4/" + val.id + "?token=" + token, {
        UserId: val.userSelector.id,
      })
      .then((res) => {
        modalEditAddress.onClose();
        val.fetchUserAddresses();
      });
  } catch (err) {
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
    val.nav("/login");
    modalEditAddress.onClose();
  }
}
async function changeMain({ val, token, Swal, api, dispatch }) {
  try {
    await api
      .patch("address/v3/" + val.id + "?token=" + token, {
        UserId: val.userSelector.id,
      })
      .then((res) => {
        Swal.fire("Good job!", "Main Address Changed", "success");
        val.setSelectIsMain(false);
        val.fetchUserAddresses();
      });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.data.response.message,
    });
    localStorage.removeItem("auth");
    localStorage.removeItem("address");
    localStorage.removeItem("Latitude");
    localStorage.removeItem("Longitude");
    dispatch({
      type: "logout",
    });
    val.nav("/login");
  }
}
const Helpers = {
  submit,
  validationSchemaAddress,
  delAddress,
  changeMain,
};
export default Helpers;
