import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MessageComponent } from './message/message.component';
import { VerifyAdminComponent } from './verify-admin/verify-admin.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { DeferLoadModule } from '@trademe/ng-defer-load';




@NgModule({
  declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent, MessageComponent, VerifyAdminComponent, VerifyUserComponent],
  imports: [
    CommonModule,
    ToastrModule,
    FormsModule,
    FontAwesomeModule,
    DeferLoadModule,
    BrowserAnimationsModule,

    RouterModule.forChild([
      { path: 'email-verify/user/:userId/:secretKey', component: VerifyUserComponent },
      { path: 'email-verify/admin/:adminId/:secretKey', component: VerifyAdminComponent },
      { path: 'message', component: MessageComponent }
    ])
  ]
})
export class UserModule { }
