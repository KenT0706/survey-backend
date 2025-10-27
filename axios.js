//axios.js
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:4000", // <-- match your backend port
  timeout: 5000,
});