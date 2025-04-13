import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './home-info.component.html',
  styleUrls: ['./home-info.component.css']
})
export class HomeInfoComponent {
constructor(
    private router: Router,
  ) {}
  
  handleStartDiagnosis(): void {
    this.router.navigate(['/page/main']);
  }
}
