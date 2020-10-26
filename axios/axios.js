import axios from "axios";

const instance = axios.create({
  baseURL: "http://110.37.224.158:9000/",
});

export default instance;
