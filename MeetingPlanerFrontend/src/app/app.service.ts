import { Injectable } from '@angular/core';
import { HttpParams, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public baseUrl = '/backendapi';
  //public baseUrl = 'http://localhost:3000';
  constructor(public _http: HttpClient) { }

  public signIn = (data): Observable<any> => {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)

    let response = this._http.post(`${this.baseUrl}/api/v1/user/login`, params);
    return response;
  }
  public signInadmin = (data): Observable<any> => {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)

    let response = this._http.post(`${this.baseUrl}/api/v1/admin/login`, params);
    return response;
  }
  public signUp = (data): Observable<any> => {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('country', data.country)
      .set('password', data.password)

    let response = this._http.post(`${this.baseUrl}/api/v1/user/signup`, params);
    return response;
  }
  public signUpAdmin = (data): Observable<any> => {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('userName', data.userName)
      .set('country', data.country)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)

    let response = this._http.post(`${this.baseUrl}/api/v1/admin/signup`, params);
    return response;
  }

  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }// end setUserInfoFromLocalstorage

  public deleteUserInfoInLocalStorage = () => {
    localStorage.removeItem('userInfo');

  }
  public getAdminInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('adminInfo'));
  } // end getUserInfoFromLocalstorage


  public setAdminInfoInLocalStorage = (data) => {
    localStorage.setItem('adminInfo', JSON.stringify(data))
  }// end setUserInfoFromLocalstorage

  public deleteAdminInfoInLocalStorage = () => {
    localStorage.removeItem('adminInfo');
  }
  public resetPassword = (data): Observable<any> => {
    const params = new HttpParams()
      .set('email', data.email)

    return this._http.post(`${this.baseUrl}/api/v1/user/resetPassword`, params);

  }
  public resetPasswordAdmin = (data): Observable<any> => {
    const params = new HttpParams()
      .set('email', data.email)

    return this._http.post(`${this.baseUrl}/api/v1/admin/resetPassword`, params);

  }
  public updatePassword = (data): Observable<any> => {
    const params = new HttpParams()
      .set('recoveryPassword', data.recoveryPassword)
      .set('password', data.password)

    return this._http.post(`${this.baseUrl}/api/v1/user/updatePassword`, params);

  }
  public updatePasswordAdmin = (data): Observable<any> => {
    const params = new HttpParams()
      .set('recoveryPassword', data.recoveryPassword)
      .set('password', data.password)

    return this._http.post(`${this.baseUrl}/api/v1/admin/updatePassword`, params);

  } // end updatePassword function
  private handleError(err: HttpErrorResponse) {
    return Observable.throw(err.message);
  }
  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))

    return this._http.post(`${this.baseUrl}/api/v1/user/logout`, params);

  }
  public logoutAdmin(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))

    return this._http.post(`${this.baseUrl}/api/v1/admin/logout`, params);
  }
  public getAllUserList(adminId) {
    const params = new HttpParams()
      .set('adminId', adminId)
      .set('authToken', Cookie.get('authToken'))
    return this._http.post(`${this.baseUrl}/api/v1/admin/get/all/users`, params)
  }
  public getAllMessage(userId) {
    const params = new HttpParams()
      .set('userId', userId)
      .set('authToken', Cookie.get('authToken'))
    return this._http.post(`${this.baseUrl}/api/v1/user/get/all/message`, params);
  }
  public getAllEvents = (detail) => {
    const params = new HttpParams()
      .set('adminId', detail.adminId)
      .set('userId', detail.userId)
      .set('authToken', Cookie.get('authToken'))
    return this._http.post(`${this.baseUrl}/api/v1/admin/get/all/events`, params)
  }
  public getUserDetail = (detail) => {
    const params = new HttpParams()
      .set('userId', detail)
      .set('authToken', Cookie.get('authToken'))
    return this._http.post(this.baseUrl + '/api/v1/admin/get/user/detail', params)
  }
  public getCountryNames(): Observable<any> {

    return this._http.get("../assets/countryList.json");

  }
  public getCountryNumbers(): Observable<any> {

    return this._http.get("../assets/countryCodes.json");

  }
  public accountVerify(accountDetail) {
    const params = new HttpParams()
      .set('userId', accountDetail.userId)
      .set('secretId', accountDetail.secretId)
    return this._http.post(this.baseUrl + '/api/v1/user/account/verify', params)
  }
  public accountVerifyAdmin(accountDetail) {
    const params = new HttpParams()
      .set('adminId', accountDetail.adminId)
      .set('secretId', accountDetail.secretId)
    return this._http.post(this.baseUrl + '/api/v1/admin/account/verify', params)
  }

  imageUpload(imageForm: FormData) {
    console.log('image uploading');
    return this._http.post(this.baseUrl + '/api/v1/user/upload',
      imageForm);
  }

  public getDetail = (detail) => {
    const params = new HttpParams()
      .set('userId', detail)
      .set('authToken', Cookie.get('authToken'))
    return this._http.post(this.baseUrl + '/api/v1/user/get/detail', params)
  }

}
