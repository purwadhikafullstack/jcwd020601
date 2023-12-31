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
async function submit({
  val,
  token,
  Swal,
  dispatch,
  formikAddress,
  modalEditAddress,
  setState,
  initialState,
}) {
  await api()
    .patch(
      "/address/v2/" + val.addressUser.id + "?token=" + token,
      formikAddress.values
    )
    .then(async (res) => {
      await val.fetchUserAddresses();
      Swal.fire("Good job!", "Address Changed", "success");
      modalEditAddress.onClose();
    })
    .catch((err) => {
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
        val.nav("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response.data.message,
        });
      }
      modalEditAddress.onClose();
      formikAddress.resetForm();
      setState({ ...initialState });
    });
}

async function delAddress({ val, token, dispatch, Swal, modalEditAddress }) {
  let address = JSON.parse(localStorage.getItem("address"));
  try {
    await api()
      .post("address/v4/" + val.addressUser.id + "?token=" + token, {
        UserId: val.userSelector.id,
      })
      .then((res) => {
        modalEditAddress.onClose();
        val.fetchUserAddresses();
      });
    if (val.addressUser.id == address.id) {
      const latitude = JSON.parse(localStorage.getItem("Latitude"));
      const longitude = JSON.parse(localStorage.getItem("Longitude"));
      const token = JSON.parse(localStorage.getItem("auth"));
      const user = await api()
        .get("/auth/v3?token=" + token)
        .then(async (res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err.message);
        });
      const userMainAddress = await api().get(
        "/address/ismain/" + val.userSelector.id
      );
      if (!userMainAddress.data) {
      }
      localStorage.setItem("address", JSON.stringify(userMainAddress.data));
      address = JSON.parse(localStorage.getItem("address"));
      const closestBranch = await api()
        .post(
          "/address/closest",
          address
            ? { lat: address.latitude, lon: address.longitude }
            : { lat: latitude, lon: longitude }
        )
        .then((res) => {
          return res.data;
        });
      dispatch({
        type: "login",
        payload: { token, ...user },
        address: address,
        closestBranch,
      });
      dispatch({
        type: "order",
        payload: {
          BranchId: closestBranch.BranchId,
          TooFar: closestBranch.TooFar,
          AddressId: address.id,
        },
      });
    }
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
      val.nav("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
    }
    modalEditAddress.onClose();
  }
}
async function changeMain({ val, token, Swal, api, dispatch }) {
  try {
    await api().patch("address/v3/" + val.addressUser.id + "?token=" + token, {
      UserId: val.userSelector.id,
    });
    Swal.fire("Good job!", "Main Address Changed", "success");
    val.setSelectIsMain(false);
    val.fetchUserAddresses();
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
      val.nav("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
    }
  }
}
const Helpers = {
  submit,
  validationSchemaAddress,
  delAddress,
  changeMain,
};
export default Helpers;
