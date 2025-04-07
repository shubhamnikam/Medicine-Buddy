import axios from "axios";
import {
  API_BASE_ENDPOINT,
  API_REQUEST_TIMEOUT,
} from "../utils/appConstants";

const axiosInstancePublic = axios.create({
  baseURL: API_BASE_ENDPOINT,
  timeout: API_REQUEST_TIMEOUT,
});

axiosInstancePublic.interceptors.request.use(
  async (req) => {
    setHeadersWithoutAuthorization(req)
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const setHeadersWithoutAuthorization = (req) => {
  req.headers["Content-Type"] = "application/json";
};

export default axiosInstancePublic;
