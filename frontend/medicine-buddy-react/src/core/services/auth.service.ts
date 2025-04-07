import { IAuthRefreshTokenInputModel } from "../models/input/IAuthRefreshTokenInputModel";
import { IAuthTokenOutputModel } from "../models/output/IAuthTokenOutputModel";
import { ICommonOutputType } from "../models/output/ICommonOutputModel";
import { IUserLoginInputModel } from "../models/input/IUserLoginInputModel";
import { IUserLogoutInputModel } from "../models/input/IUserLogoutInputModel";
import {
  ACCESS_TOKEN,
  API_Auth_Login,
  API_Auth_Logout,
  API_Auth_RefreshToken,
  IS_AUTHENTICATION_SUCCESS,
  REFRESH_TOKEN,
} from "../utils/appConstants";
import axiosInstance, { isTokenValid } from "./axiosInstance.service";
import axiosInstancePublic from "./axiosInstancePublic.service";
import { getFromSessionStorage } from "./storage.service";

export const isUserAuthenticated = (): boolean => {
  let isUserAuthenticated = false;
  try {
    const isAuthenticationSuccess = getFromSessionStorage(
      IS_AUTHENTICATION_SUCCESS
    );
    const accessToken = getFromSessionStorage<string>(ACCESS_TOKEN);
    const refreshToken = getFromSessionStorage<string>(REFRESH_TOKEN);

    if (!isAuthenticationSuccess || !accessToken || !refreshToken) {
      isUserAuthenticated = false;
    } else {
      isUserAuthenticated = isTokenValid(accessToken);
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    isUserAuthenticated = false;
  }

  return isUserAuthenticated;
};

export const authenticate = async (
  input: IUserLoginInputModel
): Promise<ICommonOutputType<IAuthTokenOutputModel>> => {
  const response = await axiosInstancePublic.post(API_Auth_Login, input);
  return response.data;
};

export const refreshToken = async (): Promise<
  ICommonOutputType<IAuthTokenOutputModel>
> => {
  const accessToken = getFromSessionStorage<string>(ACCESS_TOKEN);
  const refreshToken = getFromSessionStorage<string>(REFRESH_TOKEN);

  if (!accessToken || !refreshToken) {
    throw new Error("accessToken/refreshToken is empty");
  }
  const input: IAuthRefreshTokenInputModel = {
    Token: accessToken,
    RefreshToken: refreshToken,
  };
  const response = await axiosInstancePublic.post(API_Auth_RefreshToken, input);
  return response.data;
};

export const logout = async (
  input: IUserLogoutInputModel
): Promise<ICommonOutputType<boolean>> => {
  const response = await axiosInstance.post(API_Auth_Logout, input);
  return response.data;
};
