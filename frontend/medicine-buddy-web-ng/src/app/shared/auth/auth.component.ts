import { HttpService } from './../../core/services/http.service';
import { AuthService } from './../../core/services/auth.service';
import { StorageService } from './../../core/services/storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { AppConstants } from 'src/app/core/utility/AppConstants';
import { ErrorService } from 'src/app/core/services/error.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  faCheckCircle = faCheckCircle;
  subAuth: any;
  loginForm!: FormGroup;
  isAuthInProgress: boolean = false;
  submitted: boolean = false;
  isDisabled: boolean = true;
  trackInitSetupConfig: any = {
    isLoginSuccess: false,
  };
  trackerInterval!: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    // Logout User if any logged in
    //this.authService.logoutUserRequest(false, false, false);

    //Initializig form group to initial value
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get loginFormControl() {
    return this.loginForm.controls;
  }

  onFormSubmit(): void {
    // Change the status of the flag
    this.submitted = true;
    this.isAuthInProgress = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.isAuthInProgress = false;
      return;
    }

    // Constructing object
    const inputObj = {
      UserName: this.loginFormControl['username'].value,
      Password: this.loginFormControl['password'].value,
    };

    // Authentiatre the user through API URL
    this.subAuth = this.authService
      .authenticateRequest(inputObj)
      .subscribe((resultObj) => {
        this.isAuthInProgress = false;
        this.trackInitSetupConfig.isLoginSuccess = true;

        // Set in Session Storage
        StorageService.setToSessionStorage(AppConstants.IS_LOGIN_SUCCESS, true);
        StorageService.setToSessionStorage(AppConstants.LOGGED_IN_USER_OBJ, {
          username: this.loginFormControl['username'].value,
        });
        this.trackerInterval = setInterval(() => {
          try{
            if (
              this.trackInitSetupConfig.isLoginSuccess
            ) {
              clearInterval(this.trackerInterval);
              console.log('trackInitSetupConfig done');

              // Set in Session Storage
              StorageService.setToSessionStorage(
                AppConstants.IS_INIT_CONFIG_FETCHING_SUCCESS,
                true
              );

              // Publish event to update navbar
              this.authService.publishAfterLoginConfigSuccess(null);
              
              // navigate to default page
              this.router.navigate(['/page/home']);
            }
          } catch (error: any){
            this.isAuthInProgress = false;
            clearInterval(this.trackerInterval);
            this.errorService.handleError(error);
            //if fails then logout
            this.authService.logoutUserRequest(true, true);
          }
        }, 500);
      },
      (error) => {
        this.isAuthInProgress = false;
        clearInterval(this.trackerInterval);
        this.errorService.handleError(error);
      });
  }

  handleRelogin(): void {
    this.authService.logoutUserRequest(true, true);
  }

  handleOnClickRegister(): void {
    this.router.navigate(['/register'])
  }

  ngOnDestroy(): void {
    if (this.subAuth) {
      this.subAuth.unsubscribe();
    }
  }
}
