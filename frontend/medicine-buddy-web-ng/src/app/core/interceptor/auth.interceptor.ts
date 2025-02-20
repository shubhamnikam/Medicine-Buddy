import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { AuthService } from './../services/auth.service';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './../services/storage.service';
import { ErrorService } from '../services/error.service';
import { AppConstants } from '../utility/AppConstants';
import { HttpService } from '../services/http.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshTokenRequestInProgress: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private httpService: HttpService,
    private errorService: ErrorService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (request.headers.get('skipTokenValidation')) {
      request = this.addHeadersWithoutToken(request);
      return next.handle(request);
    } else {
      //check current access token
      let accessToken = StorageService.getFromSessionStorage(
        AppConstants.ACCESS_TOKEN
      );
      if (accessToken && this.isTokenValid(accessToken)) {
        request = this.addHeadersWithToken(request);
        return next.handle(request);
      } else {
        //TODO: handle failed error ==>  create try catch and if catch then logout
        return this.handleRefreshTokenRequest(request, next);
      }
    }
  }

  private addHeadersWithoutToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }

  private addHeadersWithToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${StorageService.getFromSessionStorage(
          AppConstants.ACCESS_TOKEN
        )}`,
      },
    });
  }

  private isTokenValid(token: string): boolean {
    let isTokenValid = false;
    try {
      //decode JWT token to JSON
      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      if (decodedToken) {
        isTokenValid = decodedToken.exp * 1000 > Date.now();
      }
    } catch (error) {
      isTokenValid = false;
      console.warn(`[TokenService.IsTokenValid] : ${error}`);
    }
    return isTokenValid;
  }

  // TODO: need to find better solution
  private handleRefreshTokenRequest(
    request: HttpRequest<any>,
    next: HttpHandler
  ) {
    if (!this.isRefreshTokenRequestInProgress) {
      this.isRefreshTokenRequestInProgress = true;
      this.refreshTokenSubject.next(null);

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
          switchMap((data: any) => {
            if (data) {
              console.info('AUTH - RefreshToken success', data);
              this.authService.todoAfterAuthSuccess(data);
              this.refreshTokenSubject.next(data.token);
              request = this.addHeadersWithToken(request);
              return next.handle(request);
            }
            // If we don't get a new token, we are in trouble so logout.
            this.authService.logoutUserRequest(true, false, false);
            return throwError(new Error("Auth Failed - New RefreshToken creation error"));
          }),
          catchError((error) => {
            // If there is an exception calling 'refreshToken', bad news so logout.
            this.authService.logoutUserRequest(true, false, false);
            return throwError(new Error("Auth Failed - New RefreshToken creation error"));
          }),
          finalize(() => {
            this.isRefreshTokenRequestInProgress = false;
          })
        );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((data) => {
          request = this.addHeadersWithToken(request);
          return next.handle(request);
        })
      );
    }
  }
}
