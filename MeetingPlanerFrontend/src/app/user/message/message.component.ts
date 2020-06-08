import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faUserPlus, faSignInAlt
} from '@fortawesome/free-solid-svg-icons';
import { faMeetup } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  faUserPlus = faUserPlus;
  faMeetup = faMeetup;
  faSignInAlt = faSignInAlt;

  meetingImage = { url: 'https://edwisor-bucket.s3.ap-south-1.amazonaws.com/meeting/meeting.jpg', show: false };
  constructor(public route: Router) { }

  ngOnInit(): void {
  }
  public goToHome() {
    this.route.navigate(['/']);
  }

}
