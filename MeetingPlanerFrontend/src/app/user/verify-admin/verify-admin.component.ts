import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import {
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';
import { faMeetup } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-verify-admin',
  templateUrl: './verify-admin.component.html',
  styleUrls: ['./verify-admin.component.scss']
})
export class VerifyAdminComponent implements OnInit {

  public adminId;
  public secretId;
  public simple;
  faSignInAlt = faSignInAlt;
  faMeetup = faMeetup;
  meetingImage = { url: 'https://edwisor-bucket.s3.ap-south-1.amazonaws.com/meeting/meeting.jpg', show: false };

  constructor(public appService: AppService, public active: ActivatedRoute, public router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.adminId = this.active.snapshot.paramMap.get('adminId');
    this.secretId = this.active.snapshot.paramMap.get('secretKey');
    this.accountVerify();

  }
  public accountVerify() {
    let detail = {
      adminId: this.adminId,
      secretId: this.secretId
    }
    this.appService.accountVerifyAdmin(detail).subscribe(
      data => {
        this.simple = data['status'];
      }
    )
  }
}
