/************************************************
* API Endpoint 
*************************************************/
export const API_BASE_ENDPOINT: string = import.meta.env.VITE_API_BASE_ENDPOINT ?? "";
export const API_REQUEST_TIMEOUT: number = 100000;


/************************************************
* API URL 
*************************************************/
export const API_Auth_Login =  'api/auth/login';
export const API_Auth_RefreshToken =  'api/auth/RefreshToken';
export const API_Auth_Logout =  'api/auth/logout';
export const API_User_Register =  'api/user/Register';
export const API_User_GetUserProfile =  'api/user/GetUserProfile';
export const API_User_GetUserHistory =  'api/user/GetUserHistory';
export const API_User_GetDiseaseSymptomMapping =  'api/home/GetDiseaseSymptomMapping';
export const API_Home_GetQuestions =  'api/home/GetQuestions';
export const API_Home_GetDiseaseMedicineMapping =  'api/home/GetDiseaseMedicineMapping';
export const API_Home_CreateUserDiseaseEntry =  'api/home/CreateUserDiseaseEntry';
export const API_Home_CreateUserQuestionEntry =  'api/home/CreateUserQuestionEntry';
export const API_Home_CreateUserMedicineEntry =  'api/home/CreateUserMedicineEntry';


/************************************************
* App configs
*************************************************/
export const IS_AUTHENTICATION_SUCCESS = "isAuthenticationSuccess";
export const AUTHENTICATED_USER_INFO = "authenticatedUserInfo";
export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";