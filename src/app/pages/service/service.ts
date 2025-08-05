import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, signal, WritableSignal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';

import { TimeInlinePipe } from '../../pipes/time-inline-pipe';

import { Header } from '../../components/header/header';
import { Error } from '../error/error';
import { Whatsapp } from '../../components/whatsapp/whatsapp';
import { Footer } from '../../components/footer/footer';
import { Datepicker } from '../../components/datepicker/datepicker';

import { Appointments } from '../../services/appointments';

@Component({
  selector: 'app-service',
  imports: [
    Header,
    Error,
    Whatsapp,
    Footer,
    CommonModule,
    TimeInlinePipe,
    Datepicker,
    FormsModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './service.html',
  styleUrl: './service.scss'
})
export class Service implements OnInit {

  company: WritableSignal<any> = signal({});
  service: WritableSignal<any> = signal({});
  theme: WritableSignal<string> = signal('gray');
  colorType: WritableSignal<number> = signal(0);
  error: boolean = false;
  daySelected = new Date();
  unavailableDates: Date[] = [];
  periods: any[] = [];
  dasyOfWeekExtended = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  appointments: any[] = [];
  isLoadingPeriod: boolean = true;
  isLoadingSend: boolean = false;
  name: string = '';
  phone: string = '';
  email: string = '';
  obsCustomer: string = '';
  submited: boolean = false;


  @ViewChild('formData') formData!: NgForm;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly title: Title,
    private readonly meta: Meta,
    private readonly appointmentsService: Appointments,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((result) => {
      console.log('Resolver result:', result);
      this.service.set(result['service']?.data ?? {});
      this.company.set(result['company']?.data ?? {});
      if (Object.keys(this.service()).length === 0) {
        this.error = true;
      } else {
        this.setInitial();
      }
    });
  }

  setInitial() {
    const title = this.service().name + ' - ' + this.company().name;
    const description = this.service().description;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });

    this.theme.set(this.company().site_setup.color || 'gray');
    this.colorType.set(this.company().site_setup.colorType || 0);
    this.setUnavailableDates();
    if (isPlatformBrowser(this.platformId)) {
      this.getAppointments();
    }
  }


  getAppointments() {
    this.isLoadingPeriod = true;
    this.appointmentsService.getAppointments(this.company().id, this.daySelected.toISOString().split('T')[0]).then((response: any) => {
      if (response.error) {
        console.log(response.error);
      } else {
        this.appointments = response.data;
        this.setPeriodIntervals();
      }
      this.isLoadingPeriod = false;
      this.cdr.detectChanges();
    });

  }

  onDateSelected(date: any) {
    this.daySelected = date;
    this.setPeriodIntervals();
  }

  setPeriodIntervals() {
    const dayOfWeekName = this.dasyOfWeekExtended[this.daySelected.getDay()];
    const dayOpeningHours = this.company()?.opening_hours[dayOfWeekName].intervals || [];
    const periodInterval = this.company()?.appointment_rules?.interval || 60;
    const minimumAdvance = this.company()?.appointment_rules?.minimumAdvance || 0;

    let generatedPeriods: string[] = [];

    const now = new Date();
    const minBookingTime = new Date(now.getTime() + minimumAdvance * 60000);

    dayOpeningHours.forEach((period: { start: string; end: string }) => {
      const [startHours, startMinutes] = period.start.split(':').map(Number);
      const [endHours, endMinutes] = period.end.split(':').map(Number);

      const startTime = new Date(this.daySelected);
      startTime.setHours(startHours, startMinutes, 0, 0);

      const endTime = new Date(this.daySelected);
      endTime.setHours(endHours, endMinutes, 0, 0);

      let currentTime = new Date(startTime);
      while (currentTime < endTime) {
        if (currentTime < minBookingTime) {
          currentTime.setMinutes(currentTime.getMinutes() + periodInterval);
          continue;
        }
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        generatedPeriods.push(`${hours}:${minutes}`);
        currentTime.setMinutes(currentTime.getMinutes() + periodInterval);
      }
    });

    const appointmentsDay = this.appointments.filter((appointment: any) => {
      return this.daySelected.toISOString().split('T')[0] === appointment.start.split('T')[0];
    });


    const daySelected = this.daySelected.toISOString().split('T')[0] + 'T';
    const overlappingCounts: number[] = [];
    let generatedPeriodsFiltred: string[] = generatedPeriods;

    appointmentsDay.forEach((appointmentA: any, indexA: number) => {
      const startA = new Date(appointmentA.start.split('+')[0]);
      const endA = new Date(appointmentA.end.split('+')[0]);

      let count = 1;

      appointmentsDay.forEach((appointmentB: any, indexB: number) => {
        if (indexA === indexB) return;

        const startB = new Date(appointmentB.start.split('+')[0]);
        const endB = new Date(appointmentB.end.split('+')[0]);

        const overlap =
        startA < endB && startB < endA;

        if (overlap) {
          count++;
        }
      });

      overlappingCounts.push(count);
    });

    appointmentsDay.forEach((appointment: any, index: number) => {
      const dateAppointmentStart = appointment.start.split('+')[0];
      const dateAppointmentEnd = appointment.end.split('+')[0];

      generatedPeriodsFiltred = generatedPeriods.filter((period: string) => {
        const datePeriod = daySelected + period + ':00';
        const verifyDates = datePeriod < dateAppointmentStart || datePeriod >= dateAppointmentEnd;
        const verifyLimit = overlappingCounts[index] < this.company().appointment_rules.numbersOfAppointments;

        return verifyDates || verifyLimit;
      });


    });

    this.periods = generatedPeriodsFiltred;

  }

  setUnavailableDates() {
    const periods = this.company()?.periods_unavailability || [];
    const datesToDisable: Date[] = [];

    periods.forEach((period: { start: string; end: string }) => {
      const startDate = new Date(period.start + 'T00:00:00');
      const endDate = new Date(period.end + 'T00:00:00');

      for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
        datesToDisable.push(new Date(dt));
      }
    });

    this.unavailableDates = datesToDisable;
  }

  verifyData() {

    this.submited = true;

    if (this.formData.invalid) return;
  }

  verifyFilled(e: any) {
    if (e.target.value.length > 0) {
      e.target.classList.add('filled');
    } else {
      e.target.classList.remove('filled');
    }
    if (e.target.localName === 'textarea') {
      this.adjustTextarea(e);
    }
  }

  adjustTextarea(e: any): void {
    const textarea = e.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 4}px`;
  }

}
