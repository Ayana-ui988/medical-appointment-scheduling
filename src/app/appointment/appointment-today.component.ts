import { Component, OnInit }  from '@angular/core';
import { ViewChild }          from '@angular/core';
import { Router }             from '@angular/router';
import { AppState }           from '../app.service';

import { Appointment }        from '../api/model/appointment';
import { ViewAppointmentService } from './appointment.service';

import * as moment            from 'moment';

@Component({
  templateUrl: './appointment-today.component.html',
  styleUrls: [ './appointment-today.component.scss' ]
})

export class AppointmentTodayComponent implements OnInit {

  private appointments: Appointment[];
  private locale: string;
  private defaultView: string;

  constructor(
    private _state: AppState,
    private router: Router,
    private viewAppointmentService: ViewAppointmentService) {}

  ngOnInit() {
    // Mouseflow integration
    if ((<any>window)._mfq) {
      (<any>window)._mfq.push(['newPageView', '/appointment/today']);
    }
    this._state.isSubPage.next(false);
    this._state.title.next(
      localStorage.getItem('locale').startsWith('de') ? 'Heute' : 'Today');
    this._state.actions.next();
    this._state.primaryAction.next({
      icon: 'add',
      routerLink: 'appointment/add'
    });
    this.getTodaysAppointments();
    this.locale = localStorage.getItem('locale').startsWith('de') ? 'de' : 'en';
    this.defaultView = 'basicDay';
  }

  private getTodaysAppointments(): void {
    let start = moment.utc().startOf('day');
    let end = moment.utc().endOf('day');
    this.viewAppointmentService
    .appointmentFind(`{"where": {"start":  {"between": ["${start.format()}", "${end.format()}"]}}}`)
    .subscribe(
      x => this.appointments = x,
      e => console.log(e),
      () => console.log('Get today\'s appointments complete')
    );
  }

  private handleEventClick(event) {
    this.router.navigate(['appointment', event.calEvent.id]);
  }
}
