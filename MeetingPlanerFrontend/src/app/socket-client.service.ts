import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketClientService {
  public baseurl = 'http://localhost:3000';
  //public baseurl = 'http://ec2-35-154-221-80.ap-south-1.compute.amazonaws.com:3000';
  public socket;
  constructor() {
    this.socket = io(this.baseurl);
  }

  public verify() {
    return Observable.create((observer) => {
      this.socket.on('verify', (data) => {
        observer.next(data);
      })
    })
  }

  public setAdmin() {
    let authToken = Cookie.get('authToken');
    this.socket.emit('set-user', authToken);
  }
  public setUser() {
    let authToken = Cookie.get('authToken');
    this.socket.emit('set-user', authToken);
  }
  public getAllOnlineUserList() {
    return Observable.create((observer) => {
      this.socket.on('online-user-list', (data) => {
        observer.next(data);
      })
    })
  }
  public messageToUser(event) {
    this.socket.emit('user-message', event)
  }
  public messageFromAdmin(userId) {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      })
    })
  }
  public deleteEvent(event) {
    this.socket.emit('delete-message', event);
  }
  public sendReminder(meeting) {
    this.socket.emit('get-reminder', meeting);
  }

  public sendReminderOffline(meeting) {
    this.socket.emit('send-message-offline', meeting);
  }
  public disconnect() {
    this.socket.disconnect();
  }
  public stopReminder(data) {

    this.socket.emit('stop-reminder', data);
  }
  public userProfileUpload(data) {
    this.socket.emit('user-profile-upload', data);
  }
  public profileUploaded() {
    return Observable.create(observer => {
      this.socket.on('profile-uploaded', data => {
        observer.next(data);
      })
    })
  }

  public notificationFromUser(adminId) {
    return Observable.create((observer) => {
      this.socket.on(adminId, (data) => {
        observer.next(data);
      })
    })
  }
  public getErrors() {
    return Observable.create((observer) => {
      this.socket.on('get-errors', (data) => {
        observer.next(data);
      })
    })
  }

}
