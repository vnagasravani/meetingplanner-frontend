import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import {
  faSignInAlt, faUserPlus, faBars
} from '@fortawesome/free-solid-svg-icons';
import { faMeetup } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobileNumber: any;
  public email: any;
  public password: any;
  public checked = false;
  public status;
  public country: string;
  public allCountries: any;
  public countries: any[] = [];
  public countryCodes: string[];
  public countryCode: string;
  public countryName: string;

  signupImage = { url: 'https://edwisor-bucket.s3.ap-south-1.amazonaws.com/meeting/signup.jpg', show: false };
  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) { }
  faSignInAlt = faSignInAlt;
  faUserPlus = faUserPlus;
  faBars = faBars;
  faMeetup = faMeetup;

  ngOnInit() {
    this.getCountries();
    this.getCountryCodes();
  }
  public goToMessage: any = () => {
    this.router.navigate(['/message']);
  }
  public getCountries() {
    this.appService.getCountryNames()
      .subscribe((data) => {
        this.allCountries = data;
        for (let i in data) {

          let singleCountry = {
            name: data[i],
            code: i
          }
          this.countries.push(singleCountry);
        }
        this.countries = this.countries.sort((first, second) => {
          return first.name.toUpperCase() < second.name.toUpperCase() ? -1 : (first.name.toUpperCase() > second.name.toUpperCase() ? 1 : 0);
        });//end sort
      })//end subscribe

  }//end getCountries
  public getCountryCodes() {
    this.appService.getCountryNumbers()
      .subscribe((data) => {
        this.countryCodes = data;
      })//end subscribe
  }//end getCountries
  public onChangeOfCountry() {

    this.countryCode = this.countryCodes[this.country];
    this.countryName = this.allCountries[this.country];
  }//end onChangeOfCountry

  public signUpFunction: any = () => {
    if (!this.firstName) {
      this.toastr.warning("Enter First Name");
    }
    else if (!this.lastName) {
      this.toastr.warning("Enter Last Name");
    }
    else if (!this.mobileNumber) {
      this.toastr.warning("Enter Mobile Number");
    }
    else if (!this.email) {
      this.toastr.warning("Enter Email Address");
    }
    else if (!this.password) {
      this.toastr.warning("Enter Password");
    }
    else if (this.checked) {
      let data = {
        firstName: this.firstName,
        userName: this.firstName + '-admin',
        country: this.country,
        lastName: this.lastName,
        mobileNumber: `${this.countryCode}${this.mobileNumber}`,
        email: this.email,
        password: this.password,
      }

      this.appService.signUpAdmin(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status == 200) {
            this.status = apiResponse.status;
            this.toastr.success('You are registered Successfully');
            setTimeout(() => {
              this.goToMessage();
            }, 1000);
          }
          else {
            this.toastr.error(apiResponse.message);
          }
        },
          (err) => {
            this.toastr.error(err.error.message);
          });

    }
    else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        country: this.country,
        mobileNumber: `${this.countryCode}${this.mobileNumber}`,
        email: this.email,
        password: this.password,
      }
      this.appService.signUp(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status == 200) {
            this.status = apiResponse.status;
            this.toastr.success('You are registered Successfully');
            setTimeout(() => {
              this.goToMessage();
            }, 1000);
          }
          else {
            this.toastr.error(apiResponse.message);
          }
        },
          (err) => {
            this.toastr.error(err.error.message);
          });

    }//End condition
  }//End signup function

}
