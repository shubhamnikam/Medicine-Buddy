import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/core/services/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  userName = ""

  constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      passwordEncrypted: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      height: ['', [Validators.required, Validators.min(0), Validators.max(250)]],
      weight: ['', [Validators.required, Validators.min(0), Validators.max(300)]],
    });
  }

  onSubmit() {
    console.log(this.registerForm.value);
    
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.httpService.registerUser(this.registerForm.value).subscribe({
      next: (response) => {
        this.successMessage = `Registration Success for Username: ${response.model}`;
        this.registerForm.reset();
      },
      error: (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  handleOnClickGotoLogin() : void {
    this.router.navigate(['/auth'])
  }
}