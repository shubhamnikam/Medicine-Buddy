import axios from "axios";
import {
  ACCESS_TOKEN,
  API_BASE_ENDPOINT,
  API_REQUEST_TIMEOUT,
  AUTHENTICATED_USER_INFO,
  IS_AUTHENTICATION_SUCCESS,
  REFRESH_TOKEN,
} from "../utils/appConstants";
import {
  getFromSessionStorage,
  removeFromSessionStorage,
  setToSessionStorage,
} from "./storage.service";
import { refreshToken } from "./auth.service";
import { IAuthTokenOutputModel } from "../models/output/IAuthTokenOutputModel";
import { ICommonOutputType } from "../models/output/ICommonOutputModel";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: API_BASE_ENDPOINT,
  timeout: API_REQUEST_TIMEOUT,
});

axiosInstance.interceptors.request.use(async (req) => {
  try {
    const oldAccessToken = getFromSessionStorage<string>(ACCESS_TOKEN);
    const oldRefreshToken = getFromSessionStorage<string>(REFRESH_TOKEN);
    if (!oldAccessToken || !oldRefreshToken) {
      throw new Error("Token not found");
    }

    if (isTokenValid(oldAccessToken)) {
      setHeadersWithAuthorization(req);
      return req;
    }

    const data: ICommonOutputType<IAuthTokenOutputModel> = await refreshToken();

    // handle logic
    removeFromSessionStorage(IS_AUTHENTICATION_SUCCESS);
    removeFromSessionStorage(AUTHENTICATED_USER_INFO);
    removeFromSessionStorage(ACCESS_TOKEN);
    removeFromSessionStorage(REFRESH_TOKEN);

    setToSessionStorage<boolean>(IS_AUTHENTICATION_SUCCESS, true);
    setToSessionStorage<IAuthTokenOutputModel>(
      AUTHENTICATED_USER_INFO,
      data.model
    );
    setToSessionStorage<string>(ACCESS_TOKEN, data.model.token);
    setToSessionStorage<string>(REFRESH_TOKEN, data.model.refreshToken);

    setHeadersWithAuthorization(req);
    return req;
  } catch (err) {
    console.error("Token refresh failed:", err);
    return Promise.reject(err);
  }
});

export const isTokenValid = (accessToken: string): boolean => {
  let isValid = false;
  try {
    const decodedToken: any = jwtDecode(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      isValid = false;
    } else {
      isValid = true;
    }
  } catch (error) {
    isValid = false;
    console.warn(`[TokenService.isValid] : ${error}`);
  }
  return isValid;
};

const setHeadersWithAuthorization = (req) => {
  const accessToken = getFromSessionStorage<string>(ACCESS_TOKEN);
  req.headers.Authorization = `Bearer ${accessToken}`;
  req.headers["Content-Type"] = "application/json";
};

export default axiosInstance;
