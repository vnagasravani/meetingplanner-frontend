import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPopperModule } from 'ngx-popper';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { ProfileComponent } from './profile/profile.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';



@NgModule({
  declarations: [HomeComponent, UserDashboardComponent, AdminDashboardComponent, ProfileComponent, PageNotFoundComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModalModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    ToastrModule.forRoot(),
    FontAwesomeModule,
    NgxPopperModule,
    OwlDateTimeModule,
    DeferLoadModule,
    OwlNativeDateTimeModule,
    Ng2ImgMaxModule,

    RouterModule.forChild([
      { path: 'user-view', component: UserDashboardComponent },
      { path: 'admin-view/:userId', component: AdminDashboardComponent },
      { path: 'admin-dashboard', component: HomeComponent },
      { path: 'profile/:userId', component: ProfileComponent },
      { path: '**', component: PageNotFoundComponent }
    ])
  ]
})
export class HomeModule { }
