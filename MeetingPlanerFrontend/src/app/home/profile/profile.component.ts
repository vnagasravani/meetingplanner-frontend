import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DomSanitizer } from '@angular/platform-browser';
import {
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketClientService } from 'src/app/socket-client.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userId: string;
  imageObj: File;
  imageUrl: string;
  imagePreview: string;
  public userInfo;
  url: string = "https://hemanth1508.s3.ap-south-1.amazonaws.com/";

  constructor(private appService: AppService,
    private ng2ImgMax: Ng2ImgMaxService,
    public sanitizer: DomSanitizer,
    public socketService: SocketClientService,
    public toastr: ToastrService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  faUserCircle = faUser;

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.getDetail();
  }
  uploadedImage: File;


  public getDetail() {
    this.appService.getDetail(this.userId).subscribe(
      data => {
        if (data['status'] == 200) {
          this.userInfo = data['data'];
        }

      }
    )
  }

  onImageChange(event) {
    let image = event.target.files[0];

    this.ng2ImgMax.resizeImage(image, 350, 300).subscribe(
      result => {
        this.uploadedImage = new File([result], result.name);
        this.getImagePreview(this.uploadedImage);
      },
      error => {
        this.toastr.error("something went wrong please upload profile again")
      }
    );
  }
  getImagePreview(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
  }


  onImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    this.imageObj = FILE;
  }

  onImageUpload() {
    const imageForm = new FormData();
    imageForm.append('image', this.uploadedImage, this.userInfo.userId + '.jpg');
    this.appService.imageUpload(imageForm).subscribe(res => {
      let data = { userId: this.userInfo.userId }
      this.profileUploaded();
      this.socketService.userProfileUpload(data);
      this.getDetail();
    });
  }

  public profileUploaded() {
    this.socketService.profileUploaded().subscribe(data => {
      if (data.status == 200) {
        this.toastr.success(data.message);
      } else {
        this.toastr.error(data.message);
      }
    })
  }
  public logout() {
    this.appService.logout().subscribe(
      data => {
        if (data.status == 200) {
          Cookie.delete('authToken');
          Cookie.delete('loggedInUser');
          this.appService.deleteUserInfoInLocalStorage()
          this.toastr.success(data.message);

          this.socketService.disconnect();

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000)
        } else {
          this.router.navigate(['/login']);

        }
      },
      (err) => {
        this.toastr.error(err.error.message);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000)
      }
    )
  }


}
