import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { faSearch, faSignOutAlt, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { AppConstants } from 'src/app/core/utility/AppConstants';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {

  faBars = faBars;
  faSearch = faSearch;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  loggedinUser: any;
  subscription :any;
  subClientList: any;
  clientList:any;
  selectedClient:any;
  productHMName:string = 'HM';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscribeAfterLoginConfigSuccess();
  }
  subscribeAfterLoginConfigSuccess():void {
    this.subscription = this.authService.obsAfterLoginConfigSuccess.subscribe((data:any) => {
      // get from session storage
      this.loggedinUser = StorageService.getFromSessionStorage(AppConstants.LOGGED_IN_USER_OBJ)?.username; 
    });
  }

  logoutUser(): void {
    this.loggedinUser = null;
    this.authService.logoutUserRequest();
  }

  isUserloggedIn(): boolean { return this.authService.isUserStillAuthenticated();}

  ngOnDestroy(): void {
    if (this.subscription) {this.subscription.unsubscribe();}
  }
}
