import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import {
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public recovery;
  public checked = false;
  public newPassword;
  public reEnterNewPassword;
  faSignInAlt = faSignInAlt;
  forgotImage = { url: 'https://edwisor-bucket.s3.ap-south-1.amazonaws.com/meeting/forgotpassword.jpg', show: false };
  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  public submit() {
    if (!this.recovery) {
      this.toastr.warning('enter recovery password ');
    }
    else if (!this.newPassword) {
      this.toastr.warning('enter new password ');
    }
    else if (!this.reEnterNewPassword) {
      this.toastr.warning('re-enter password');
    }
    else if (!(this.newPassword === this.reEnterNewPassword)) {
      this.toastr.warning('password is not being matched');
    }
    else if (this.checked == false) {
      let object = {
        recoveryPassword: this.recovery,
        password: this.newPassword

      }

      this.appService.updatePassword(object).subscribe(
        data => {
          if (data.status == 200) {
            this.toastr.success('password updated successfully');
            setTimeout(() => {

              this.goToLogIn();
            }, 1500);
          }
        }
      )
    }
    else {
      let object = {
        recoveryPassword: this.recovery,
        password: this.newPassword

      }

      this.appService.updatePasswordAdmin(object).subscribe(
        data => {
          if (data.status == 200) {
            this.toastr.success('password updated successfully');
            setTimeout(() => {

              this.goToLogIn();
            }, 1500);
          }
        }
      )

    }
  }
  public goToLogIn() {
    this.router.navigate(['/log-in']);
  }

}
