import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap, map, filter, catchError } from 'rxjs/operators';
import { AppConstants } from '../utility/AppConstants';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { ICreateUserMedicineEntry, ICreateUserSymptomEntry, IGetDiseaseMedicineMapping, IGetDiseaseSymptomMapping, IGetQuestions, IGetUserProfile, IUserRegister } from '../interfaces/IGetDiseaseSymptomMapping';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getDiseaseSymptomsMapping(): Observable<IGetDiseaseSymptomMapping> {
    const URL = AppConstants.getCompleteURL(
      'GetDiseaseSymptomMapping'
    );
    return this.http
      .get<IGetDiseaseSymptomMapping>(URL)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  
  getQuestions(transactionId: string): Observable<IGetQuestions> {
    const URL = AppConstants.getCompleteURL(
      'GetQuestions'
    );
    return this.http
      .post<IGetQuestions>(URL, JSON.stringify({transactionId: transactionId}))
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  
  getDiseaseMedicineMapping(transactionId: string, diseaseId: Number): Observable<IGetDiseaseMedicineMapping> {
    const URL = AppConstants.getCompleteURL(
      'GetDiseaseMedicineMapping'
    );
    return this.http
      .post<IGetDiseaseMedicineMapping>(URL, JSON.stringify({transactionId: transactionId, diseaseId: diseaseId}))
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  
  createUserSymptomEntry(userId: Number, diseaseId: Number, transactionId: string): Observable<ICreateUserSymptomEntry> {
    const URL = AppConstants.getCompleteURL(
      'CreateUserDiseaseEntry'
    );
    return this.http
      .post<ICreateUserSymptomEntry>(URL, JSON.stringify({userId: userId, diseaseId: diseaseId, transactionId: transactionId}))
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  
  createUserMedicineEntry(data: any[]): Observable<ICreateUserMedicineEntry> {
    const URL = AppConstants.getCompleteURL(
      'CreateUserMedicineEntry'
    );
    return this.http
      .post<ICreateUserMedicineEntry>(URL, JSON.stringify(data))
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  
  getUserProfile(userId: Number): Observable<IGetUserProfile> {
    const URL = AppConstants.getCompleteURL(
      'GetUserProfile'
    );
    return this.http
      .post<IGetUserProfile>(URL, JSON.stringify({userId: userId}))
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  
  registerUser(data: {}): Observable<IUserRegister> {
    const URL = AppConstants.getCompleteURL(
      'Register'
    );
    return this.http
      .post<IUserRegister>(URL, JSON.stringify(data), { headers: new HttpHeaders({ skipTokenValidation: 'true' }) })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

}
