import axios from "axios";

const instance = axios.create({
  // baseURL: "http://110.37.224.158:9000/",
  // baseURL: "http://192.168.0.131:5101/",
  baseURL: "http://94.200.123.222:5005/",
});

export default instance;
