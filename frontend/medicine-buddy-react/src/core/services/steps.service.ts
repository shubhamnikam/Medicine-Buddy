import { ICreateUserDiseaseEntryInputModel } from "../models/input/ICreateUserDiseaseEntryInputModel";
import { ICreateUserMedicineEntryInputModel } from "../models/input/ICreateUserMedicineEntryInputModel";
import { IGetQuestionsInputModel } from "../models/input/IGetQuestionsInputModel";
import { IGetDiseaseMedicineMappingInputModel } from "../models/input/IGetQuestionsInputModel copy";
import { ICreateUserQuestionEntryInputModel } from "../models/input/IUserLogoutInputModel copy";
import { ICommonOutputType } from "../models/output/ICommonOutputModel";
import { ICreateUserDiseaseEntryOutputModel } from "../models/output/ICreateUserDiseaseEntryOutputModel";
import { IGetDiseaseMedicineMappingOutputModel } from "../models/output/IGetDiseaseMedicineMappingOutputModel";
import { IGetDiseaseSymptomMappingOutputModel } from "../models/output/IGetDiseaseSymptomMappingOutputModel";
import { IGetQuestionsOutputModel } from "../models/output/IGetQuestionsOutputModel";
import { API_Home_CreateUserDiseaseEntry, API_Home_CreateUserMedicineEntry, API_Home_CreateUserQuestionEntry, API_Home_GetDiseaseMedicineMapping, API_Home_GetQuestions, API_User_GetDiseaseSymptomMapping } from "../utils/appConstants";
import axiosInstance from "./axiosInstance.service";

export const getDiseaseSymptomMapping = async (): Promise<
  ICommonOutputType<IGetDiseaseSymptomMappingOutputModel[]>
> => {
  const response = await axiosInstance.get(API_User_GetDiseaseSymptomMapping);
  return response.data;
};

export const createUserDiseaseEntry = async (input: ICreateUserDiseaseEntryInputModel): Promise<
  ICommonOutputType<ICreateUserDiseaseEntryOutputModel>
> => {
  const response = await axiosInstance.post(API_Home_CreateUserDiseaseEntry, input);
  return response.data;
};

export const getQuestions = async (input: IGetQuestionsInputModel): Promise<
  ICommonOutputType<IGetQuestionsOutputModel[]>
> => {
  const response = await axiosInstance.post(API_Home_GetQuestions, input);
  return response.data;
};

export const createUserQuestionEntry = async (input: ICreateUserQuestionEntryInputModel[]): Promise<
  ICommonOutputType<boolean>
> => {
  const response = await axiosInstance.post(API_Home_CreateUserQuestionEntry, input);
  return response.data;
};

export const getDiseaseMedicineMapping = async (input: IGetDiseaseMedicineMappingInputModel): Promise<
  ICommonOutputType<IGetDiseaseMedicineMappingOutputModel[]>
> => {
  const response = await axiosInstance.post(API_Home_GetDiseaseMedicineMapping, input);
  return response.data;
};

export const createUserMedicineEntry = async (input: ICreateUserMedicineEntryInputModel[]): Promise<
  ICommonOutputType<boolean>
> => {
  const response = await axiosInstance.post(API_Home_CreateUserMedicineEntry, input);
  return response.data;
};

