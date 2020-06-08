import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import {
  faLock, faUserPlus, faSignInAlt, faBars
} from '@fortawesome/free-solid-svg-icons';
import { faMeetup } from '@fortawesome/free-brands-svg-icons';

import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;
  public checked = false;

  faLock = faLock;
  faUserPlus = faUserPlus;
  faMeetup = faMeetup;
  faSignInAlt = faSignInAlt;
  faBars = faBars;

  meetingImage = { url: 'https://edwisor-bucket.s3.ap-south-1.amazonaws.com/meeting/meeting.jpg', show: false };
  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) {

  }

  ngOnInit() {
  }
  public gotoAdminWindow: any = () => {
    this.router.navigate(['/admin-dashboard']);
  }
  public gotoUserWindow = () => {
    this.router.navigate(['/user-view'])
  }

  public gotoResetPassword: any = () => {
    this.router.navigate(['/forgot-password']);
  }
  public signUpFunction() {
    this.router.navigate(['/signup'])
  }


  public logInFunction: any = () => {
    if (!this.email) {
      this.toastr.warning("Enter Email Address");
    }
    else if (!this.password) {
      this.toastr.warning("Enter Password");
    }
    else if (this.checked) {
      let data = {
        email: this.email,
        password: this.password,
      }

      this.appService.signInadmin(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status == 200 && apiResponse.data.adminDetails.activated == true) {
            Cookie.set('authToken', apiResponse.data.authToken);
            Cookie.set('loggedInAdmin', apiResponse.data.adminDetails.adminId);
            this.appService.setAdminInfoInLocalStorage(apiResponse.data.adminDetails)
            this.toastr.success('you logged in Successfully');
            setTimeout(() => {
              this.gotoAdminWindow();
            }, 1000);

          }
          else if (apiResponse.data.adminDetails.activated == false) {
            this.toastr.warning('your account is not verified');
          }
        },
          (err) => {
            this.toastr.error(err.error.message);
          });

    } else {
      let data = {
        email: this.email,
        password: this.password,
      }

      this.appService.signIn(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status == 200 && apiResponse.data.userDetails.activated == true) {

            Cookie.set('authToken', apiResponse.data.authToken);
            Cookie.set('loggedInUser', apiResponse.data.userDetails.userId);


            this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
            this.toastr.success('you logged in Successfully');


            setTimeout(() => {
              this.gotoUserWindow();
            }, 1000);

          }
          else if (apiResponse.data.userDetails.activated == false) {
            this.toastr.warning('your account is not verified');
          }
        },
          (err) => {
            this.toastr.error(err.error.message);
          });

    }//End condition
  }//End signin function

  public loginUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.

      this.logInFunction();

    }

  } // end sendMessageUsingKeypress

  public resetPassword: any = () => {
    if (!this.email) {
      this.toastr.warning("Enter Email Id ");
    }
    else if (this.checked) {
      let data = {
        email: this.email,
      }

      this.appService.resetPasswordAdmin(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status == 200) {
            this.toastr.success('Email has sent to your registered Email ID. Please follow that instructions to reset your password');
            setTimeout(() => {
              this.gotoResetPassword();
            }, 1000);
          }
          else {
            this.toastr.error(apiResponse.message);
          }
        },
          (err) => {
            this.toastr.error("if you are admin then also click on checkbox");
          });

    }
    else {
      let data = {
        email: this.email,
      }

      this.appService.resetPassword(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status == 200) {
            this.toastr.success('Email has sent to your registered Email ID. Please follow that instructions to reset your password');
            setTimeout(() => {
              this.gotoResetPassword();
            }, 1000);
          }
          else {
            this.toastr.error(apiResponse.message);
          }
        },
          (err) => {
            this.toastr.error("if you are admin then also click on checkbox");
          });

    }
  }//End signup function

}
