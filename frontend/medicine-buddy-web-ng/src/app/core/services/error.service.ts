import { StorageService } from './storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {

  constructor(private router: Router, private authService: AuthService) { }


  handleError(error: Error | HttpErrorResponse, titleToastr: any = "Something went wrong", consoleLogType: string="WARN"): void {

    if(error instanceof HttpErrorResponse){
      //logs error in all conditions
      console.error(error);
      //handle server http side error
      if(!navigator.onLine){
        //handle offline error
        console.error("Network error", "Check your internet connection...");
      } else {
        //handle http errors
        const httpErrorCode = error.status;
        switch (httpErrorCode) {
          case StatusCodes.UNAUTHORIZED: {
            console.error(`Server Error ${getReasonPhrase(StatusCodes.UNAUTHORIZED)}`, error.error?.message || error?.message);
            this.authService.logoutUserRequest();
          } break;
          case StatusCodes.FORBIDDEN: {
            console.error(`Server Error ${getReasonPhrase(StatusCodes.FORBIDDEN)}`, error.error?.message || error?.message);
            this.authService.logoutUserRequest();
          } break;
          case StatusCodes.NOT_FOUND:  {
            console.error(`Server Error ${getReasonPhrase(StatusCodes.NOT_FOUND)}`, error.error?.message || error?.message);
            this.authService.logoutUserRequest();
          } break;
          case StatusCodes.BAD_REQUEST:  {
            console.error(`Server Error ${getReasonPhrase(StatusCodes.BAD_REQUEST)}`, error.error?.message || error?.message);
          } break;
          default:{
            console.error(`Server Error Something went wrong`, error.error?.message || error?.message);
          } break;
        }
      }
     } else {
        //logs error in all conditions
        if(consoleLogType === "WARN"){
          console.warn([titleToastr], error?.message);
          //handle client side error
          console.error(titleToastr, error?.message);
        } else {
          console.error([titleToastr], error.message);
          //handle client side error
          console.error(titleToastr, error?.message);
        }
    }
  }
}
