import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './features/profile/profile.component';
import { HistoryComponent } from './features/history/history.component';
import { HomeComponent } from './features/home/home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// IMPORT - EXTERNAL
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavComponent } from './shared/nav/nav.component';
import { MainComponent } from './features/main/main.component';
import { RegisterComponent } from './features/register/register.component';
// import { ToastrModule } from 'ngx-toastr';

// IMPORT - INTERNAL

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    HistoryComponent,
    NavComponent,
    MainComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // ToastrModule.forRoot({
    //   progressBar: true,
    //   positionClass: 'toast-bottom-right',
    //   preventDuplicates: true,
    //   closeButton: true,
    //   resetTimeoutOnDuplicate: true,
    //   newestOnTop: true,
    //   includeTitleDuplicates: true,
    // })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
