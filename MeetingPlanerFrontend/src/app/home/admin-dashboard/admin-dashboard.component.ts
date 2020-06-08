import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import {
  faPowerOff, faBars,
  faUserCircle, faHome, faCalendarCheck, faEdit, faTrashAlt, faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { faMeetup } from '@fortawesome/free-brands-svg-icons';
import { endOfDay, isSameDay, isSameMonth, isToday } from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { SocketClientService } from 'src/app/socket-client.service';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Cookie } from 'ng2-cookies';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#24a0ed',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SocketClientService]
})
export class AdminDashboardComponent implements OnInit {
  public adminUserName;
  public userId;
  public userInfo = [];
  public adminInfo;
  public eventList;
  public description;
  public event;
  public count = 0;
  public userList;
  public currentEvent;
  public componentView: string = 'calendar';

  constructor(
    public socketService: SocketClientService,
    public appService: AppService,
    public toastr: ToastrService,
    private modal: NgbModal,
    public router: Router,
    public route: ActivatedRoute) { }


  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.getUserDetail();
    this.verifyAdmin();

    this.getOnlineUserList();
    this.adminInfo = this.appService.getAdminInfoFromLocalstorage();
    this.adminUserName = this.adminInfo.userName;
    this.getAllEvents();
    this.stopReminder();
    this.getErrors();
  }

  faPowerOff = faPowerOff;
  faBars = faBars;
  faUser = faUserCircle;

  faMeetup = faMeetup;
  faHome = faHome;
  faCalendarCheck = faCalendarCheck;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faCalendarAlt = faCalendarAlt;

  public goToHome() {
    this.router.navigate(['/admin-dashboard']);
  }

  public verifyAdmin() {
    this.socketService.verify().subscribe(
      data => {
        this.socketService.setAdmin();
      }
    )
  }
  public stopReminder() {
    this.socketService.notificationFromUser(this.adminInfo.adminId).subscribe(
      data => {
        if (data.status == 200) {
          this.events = [];
          this.getAllEvents();
        }
      }
    )
  }
  public getUserDetail() {
    this.appService.getUserDetail(this.userId).subscribe(
      data => {
        if (data['status'] == 200) {
          this.userInfo = data['data'];
        }

      }
    )
  }
  public getErrors() {
    this.socketService.getErrors().subscribe(
      data => {
        if (data.status == 500) {
          this.toastr.warning(data.message);
        }
      }
    )
  }
  public getReminder() {
    let currentTime = new Date();
    for (let meeting of this.events) {
      let flag = false;
      if (isToday(meeting.start) && meeting['alert'] == false) {
        let difference = meeting.start.getTime() - currentTime.getTime();
        if (difference > 0 && difference < 180000) {
          for (let user in this.userList) {
            if (user == this.userId) {
              meeting['alert'] = true;
              this.socketService.sendReminder(meeting);
              flag = true;
            }
          }
          if (flag == false) {
            this.socketService.sendReminderOffline(meeting);
          }


        }
      }
    }
  }

  public getAllEvents() {
    let data = {
      adminId: this.adminInfo.adminId,
      userId: this.userId
    }
    this.appService.getAllEvents(data).subscribe(
      data => {
        if (data['status'] == 200) {
          for (let event of data['data']) {
            event.start = new Date(event.start);
            event.end = new Date(event.end);
            this.events.push(event);
            this.refresh.next();
          }
          setTimeout(() => {
            this.getReminder();
          }, 2000);

        }
      }
    )
  }
  public getOnlineUserList() {
    this.socketService.getAllOnlineUserList().subscribe(
      data => {
        this.userList = data;
      }
    )

  }
  public LogOut() {

    this.appService.logoutAdmin().subscribe(
      data => {
        if (data.status == 200) {
          Cookie.delete('authToken');
          Cookie.delete('loggedInAdmin');
          this.appService.deleteAdminInfoInLocalStorage()
          this.toastr.success(data.message);
          this.socketService.disconnect();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000)
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

  @ViewChild('modalContent', { static: true })
  modalContent: TemplateRef<any>;
  events: CalendarEvent[] = [];

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<fa-icon class="faPencilAlt"></fa-icon>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<fa-icon class="faTimes"></fa-icon>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();


  activeDayIsOpen: boolean = true;


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.sendToUSer(event);
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }


  addEvent(): void {
    this.event = {
      title: 'New event',
      userId: this.userId,
      description: this.description,
      userName: this.userInfo[0].firstName,
      userEmailId: this.userInfo[0].email,
      adminId: this.adminInfo.adminId,
      color: colors.red,
      adminUserName: this.adminUserName,
      start: new Date(),
      end: endOfDay(new Date()),
      alert: false,
      draggable: false,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    };
    this.refresh.next();
  }
  public dynamic(event) {
    this.currentEvent = event;
  }
  public sendToUSer(event) {

    if (event.notificationId) {
      event.alert = false;
      this.toastr.success('meeting schedule has been modified and sent to ' + event.userName);

      this.socketService.messageToUser(event);
      this.events = [];
      setTimeout(() => {
        this.getAllEvents();

      }, 500)
    }
    else {
      this.toastr.success('meeting schedule has been sent to ' + event.userName);
      this.socketService.messageToUser(event);
      this.events = [];
      setTimeout(() => {
        this.getAllEvents();

      }, 500)
    }
  }
  public deleteEvent(event) {
    this.toastr.success(` "${event.title}" schedule has been deleted `);
    this.socketService.deleteEvent(event);
    this.events = [];
    setTimeout(() => {
      this.getAllEvents();

    }, 500)

  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  setView(view: CalendarView) {
    this.view = view;
  }

  setComponentView(view: string) {
    this.componentView = view;
  }
}
