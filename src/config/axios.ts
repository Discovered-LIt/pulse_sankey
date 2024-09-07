import axios from "axios";

export default axios.create({
  baseURL: "https://d16knz2r0dpe77.cloudfront.net",
  // headers: {'X-Custom-Header': 'xxx'}
});
