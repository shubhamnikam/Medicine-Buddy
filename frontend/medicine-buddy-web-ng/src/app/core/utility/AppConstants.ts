import { StorageService } from './../services/storage.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class AppConstants {
  static ACCESS_TOKEN = "accessToken";
  static REFRESH_TOKEN = "refreshToken";
  static IS_LOGIN_SUCCESS = "isLoginSuccess";
  static IS_INIT_CONFIG_FETCHING_SUCCESS = "isInitConfigFetchingSuccess";
  static LOGGED_IN_USER_COMPLETE_OBJ = "LOGGED_IN_USER_COMPLETE_OBJ";
  static LOGGED_IN_USER_OBJ = "loggedInUserObj";
  //NOTE =====GET values as per env===========
  private static readonly API_ENDPOINT: string = environment.API_ENDPOINT;

  private static readonly URL_ACTION_METHOD: object = {
    login: 'api/auth/login',
    RefreshToken: 'api/auth/RefreshToken',
    logout: 'api/auth/logout',
    Register: 'api/user/Register',
    GetUserProfile: 'api/user/GetUserProfile',
    GetUserHistory: 'api/user/GetUserHistory',
    GetDiseaseSymptomMapping: 'api/home/GetDiseaseSymptomMapping',
    GetQuestions: 'api/home/GetQuestions',
    GetDiseaseMedicineMapping: 'api/home/GetDiseaseMedicineMapping',
    CreateUserDiseaseEntry: 'api/home/CreateUserDiseaseEntry',
    CreateUserQuestionEntry: 'api/home/CreateUserQuestionEntry',
    CreateUserMedicineEntry: 'api/home/CreateUserMedicineEntry',
  };

  public static getHostURL(): string {
    return AppConstants.API_ENDPOINT;
  }

  public static getCompleteURL(key: string): string {
    if (key && AppConstants.URL_ACTION_METHOD.hasOwnProperty(key)) {
      return `${AppConstants.getHostURL()}${(AppConstants.URL_ACTION_METHOD as any)[key]
      }`;
    }
    return 'INVALID_KEY';
  }
}