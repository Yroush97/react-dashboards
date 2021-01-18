import axios from "axios";
const instancs = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  Headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
});
export default instancs;