import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { Observable, of, observable, BehaviorSubject, throwError } from 'rxjs';
import { AppConstants } from './../utility/AppConstants';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mapTo, tap, catchError } from 'rxjs/operators';
import { UtilityService } from './utility.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private subAfterLoginConfigSuccess= new BehaviorSubject({});
  obsAfterLoginConfigSuccess = this.subAfterLoginConfigSuccess.asObservable();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private utiltyService: UtilityService
  ) {}

  // [GET] - Authenticate User
  authenticateRequest(inputObj: any): Observable<any> {
    return this.httpClient
      .post<any>(
        AppConstants.getCompleteURL(
          'login'
        ),
        JSON.stringify(inputObj),
        { headers: new HttpHeaders({ skipTokenValidation: 'true' }) }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        }),
        tap((data) => {
          this.todoAfterAuthSuccess(data.model);
        }),
        mapTo(true)
      );
  }

  // [POST] - Refresh Token if token is invalid
  refreshTokenRequest()  {
    const inputObj = {
      token: StorageService.getFromSessionStorage(AppConstants.ACCESS_TOKEN),
      refreshToken: StorageService.getFromSessionStorage(
        AppConstants.REFRESH_TOKEN
      ),
    };
    return this.httpClient
      .post<any>(
        AppConstants.getCompleteURL(
          'RefreshToken'
        ),
        inputObj,
        { headers: new HttpHeaders({ skipTokenValidation: 'true' }) }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        }),
        tap((data) => {
          this.todoAfterAuthSuccess(data.model);
        })
      );
  }

  // [POST] - Client + Server logout
  logoutUserRequest(
    navigateToAuth: boolean = true,
    hardReloadRequired: boolean = false,
    logoutFromServer: boolean = true
  ): void {
    if (logoutFromServer) {
      const username =
        StorageService.getFromSessionStorage(AppConstants.LOGGED_IN_USER_OBJ)?.username ?? '';
      if (username) {
        const usernameEncoded = StorageService.getEncodedText(username) ?? '';
        const params = new HttpParams().append('username', usernameEncoded);
        const URL = AppConstants.getCompleteURL(
          'logout'
        );
        //api call to logout
        this.httpClient
          .get<any>(URL, {
            params: params,
            headers: new HttpHeaders({ skipTokenValidation: 'true' }),
          })
          .subscribe(
            (data) => {
              console.info('Logout success', data.model);
            },
            (error) => {
              console.error('Logout error', error);
            }
          );
      }
    }

    //clear session storage
    StorageService.clearAllSessionStorage();

    if (navigateToAuth) {
      if (hardReloadRequired) {
        this.utiltyService.reloadCurrentPage(true);
      } else {
        this.router.navigate(['/auth']);
      }
    }
  }

  // Save data to session
  todoAfterAuthSuccess(data: any): void {
    if (data) {
      StorageService.setToSessionStorage(AppConstants.ACCESS_TOKEN, data.token);
      StorageService.setToSessionStorage(
        AppConstants.REFRESH_TOKEN,
        data.refreshToken
      );
      StorageService.setToSessionStorage(
        AppConstants.IS_INIT_CONFIG_FETCHING_SUCCESS,
        data?.model
      );
      StorageService.setToSessionStorage(
        AppConstants.LOGGED_IN_USER_COMPLETE_OBJ,
        data
      );
    }
  }

  // Check if user logged in
  isUserStillAuthenticated(): boolean {
    const isLoginSuccess = StorageService.getFromSessionStorage(
      AppConstants.IS_LOGIN_SUCCESS
    );
    const accessToken = StorageService.getFromSessionStorage(
      AppConstants.ACCESS_TOKEN
    );
    const refreshToken = StorageService.getFromSessionStorage(
      AppConstants.ACCESS_TOKEN
    );
    const userName = StorageService.getFromSessionStorage(
      AppConstants.LOGGED_IN_USER_OBJ
    )?.username;
    if (isLoginSuccess && accessToken && refreshToken && userName) {
      return true;
    } else {
      return false;
    }
  }

  publishAfterLoginConfigSuccess(data: any): void {
    this.subAfterLoginConfigSuccess.next(data);
  }
}
