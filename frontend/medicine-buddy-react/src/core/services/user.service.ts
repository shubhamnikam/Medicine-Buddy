import { ICommonOutputType } from "../models/output/ICommonOutputModel";
import { IUserLoginInputModel } from "../models/input/IUserLoginInputModel";
import {
  API_User_Register,
} from "../utils/appConstants";
import axiosInstancePublic from "./axiosInstancePublic.service";

export const register2 = async (
  input: IUserLoginInputModel
): Promise<ICommonOutputType<string>> => {
  const response = await axiosInstancePublic.post(API_User_Register, input);
  return response.data;
};
