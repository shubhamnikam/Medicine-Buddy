import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IGetUserProfileModel } from 'src/app/core/interfaces/IGetDiseaseSymptomMapping';
import { ErrorService } from 'src/app/core/services/error.service';
import { HttpService } from 'src/app/core/services/http.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { AppConstants } from 'src/app/core/utility/AppConstants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  sub_getProfile!: any;
  user!: IGetUserProfileModel;
   constructor(
      private router: Router,
      private httpService: HttpService,
      private errorService: ErrorService,
    ) {}
  ngOnInit(): void {
    const userObject = StorageService.getFromSessionStorage(AppConstants.LOGGED_IN_USER_COMPLETE_OBJ);
    this.sub_getProfile = this.httpService
    .getUserProfile(userObject.userId)
    .subscribe(
      (resultObj) => {
        console.log(resultObj);
        this.user = resultObj.model;
      },
      (error) => {
        this.errorService.handleError(error);
      }
    );
  }
  ngOnDestroy(): void {
    if(this.sub_getProfile){
      this.sub_getProfile.unsubscribe()
    }
  }
  

}
