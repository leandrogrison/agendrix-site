import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, signal, WritableSignal, ViewChild, DOCUMENT } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';
import { NgxTurnstileModule } from "ngx-turnstile";

import { TimeInlinePipe } from '../../pipes/time-inline-pipe';

import { Header } from '../../components/header/header';
import { Error } from '../error/error';
import { Whatsapp } from '../../components/whatsapp/whatsapp';
import { Footer } from '../../components/footer/footer';
import { Datepicker } from '../../components/datepicker/datepicker';

import { Appointments } from '../../services/appointments';
import { Customer } from '../../services/customer';
import { Captcha } from '../../services/captcha';
import { Auth } from '../../services/auth';

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
    NgxMaskDirective,
    NgxTurnstileModule
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
  periodSelected: string = '';
  name: string = '';
  phone: string = '';
  email: string = '';
  password: string = '';
  obsCustomer: string = '';
  submited: boolean = false;
  appointmentsLoaded: boolean = false;
  showSendCode: boolean = false;
  errorCustomer: string = '';
  showCaptcha: WritableSignal<boolean> = signal(false);
  isLoadingSend: WritableSignal<boolean> = signal(false);
  siteKey = '0x4AAAAAABqnTcQ3G3y8TWcm';
  captchaToken: string | null = null;


  @ViewChild('formData') formData!: NgForm;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly title: Title,
    private readonly meta: Meta,
    private readonly appointmentsService: Appointments,
    private readonly customerService: Customer,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly viewportScroller: ViewportScroller,
    private readonly captcha: Captcha,
    private readonly auth: Auth,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((result) => {
      this.service.set(result['service']?.data ?? {});
      this.company.set(result['company']?.data ?? {});
      if (Object.keys(this.company()).length === 0) {
        this.error = true;
      } else {
        this.setInitial();
      }
    });
  }


  setInitial() {
    const title = this.service().name + ' - ' + this.company().name;
    const description = this.service().description ? this.service().description : 'Serviço de ' + this.service().name + ' na empresa ' + this.company().name;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });

    this.theme.set(this.company().site_setup.color || 'gray');
    this.colorType.set(this.company().site_setup.colorType || 0);
    this.setUnavailableDates();
    if (isPlatformBrowser(this.platformId)) {
      this.getAppointments();
      this.viewportScroller.scrollToPosition([0, 0]);
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
        this.appointmentsLoaded = true;
      }
      this.isLoadingPeriod = false;
      this.cdr.detectChanges();
    });

  }

  onDateSelected(date: any) {
    this.daySelected = date;
    this.periodSelected = '';
    const widthWindow = this.document.defaultView?.innerWidth || 0;

    if (this.appointmentsLoaded && widthWindow < 767) this.viewportScroller.scrollToAnchor('anchorPeriod');
    this.setPeriodIntervals();
  }

  onPeriodSelected(period: any) {
    this.periodSelected = period;
    const widthWindow = this.document.defaultView?.innerWidth || 0;

    if (this.appointmentsLoaded && widthWindow < 767) this.viewportScroller.scrollToAnchor('anchorData');
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

      generatedPeriodsFiltred = generatedPeriodsFiltred.filter((period: string) => {
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
    this.showCaptcha.set(false);

    const widthWindow = this.document.defaultView?.innerWidth || 0;

    if (this.periodSelected === '' && widthWindow < 767) this.viewportScroller.scrollToAnchor('anchorPeriod');

    if (this.periodSelected === '') return;

    if (this.formData.invalid) return;

    this.isLoadingSend.set(true);
    this.showCaptcha.set(true);
    this.cdr.detectChanges();
  }

  async sendCaptchaResponse(captchaResponse: string | null) {
    this.captchaToken = captchaResponse;
    if (!this.captchaToken) {
      this.isLoadingSend.set(false);
      return;
    }

    try {
      const sessionData = await this.captcha.sendCaptcha(this.captchaToken);

      if (sessionData.session && sessionData.user) {
        this.auth.setSession(sessionData.session).then((response: any) => {
          if (response.error) {
            console.log(response.error);
            this.errorCustomer = 'Erro ao confirmar agendamento, tente novamente.';
            this.isLoadingSend.set(false);
          } else {
            this.verifyCustomer();
          }
        });
      } else {
        throw new Error();
      }
    } catch (error: any) {
      console.error(error);
      this.errorCustomer = 'Erro ao confirmar agendamento, tente novamente.';
      this.isLoadingSend.set(false);
    } finally {
      this.cdr.detectChanges();
    }
  }

  verifyCustomer() {
    this.errorCustomer = '';

    this.customerService.getCustomerByPhone(this.phone, this.company().id).then((response: any) => {
      if (response.error) {
        console.log(response.error);
        this.errorCustomer = 'Erro ao verificar usuário';
        this.isLoadingSend.set(false);
      } else {
        if (response.data.length === 0) {
          this.addCustomer();
        } else {
          this.updateCustomer(response.data[0]);
        }
      }
      this.showCaptcha.set(false);
      this.cdr.detectChanges();
    });
  }

  addCustomer() {
    this.customerService.addCustomer([{
      name: this.name,
      email: this.email,
      phone: this.phone,
      company_id: [this.company().id],
    }]).then((response: any) => {
      if (response.error) {
        console.log(response.error);
        this.errorCustomer = 'Erro ao confirmar agendamento, tente novamente.';
        this.isLoadingSend.set(false);
      } else {
        this.addAppointment(response.data[0]);
      }
      this.cdr.detectChanges();
    });
  }

  updateCustomer(customer: any) {
    this.customerService.updateCustomer([{
      id: customer.id,
      name: this.name,
      email: this.email,
    }]).then((response: any) => {
      if (response.error) {
        console.log(response.error);
        this.errorCustomer = 'Erro ao confirmar agendamento, tente novamente.';
        this.isLoadingSend.set(false);
      } else {
        this.addAppointment(response.data[0]);
      }
      this.cdr.detectChanges();
    });

  }

  addAppointment(customer: any) {
    const offsetDate = this.daySelected.getTimezoneOffset();
    const start = this.daySelected.toISOString().split('T')[0] + 'T' + this.periodSelected + ':00';
    const [hoursToAdd, minutesToAdd] = this.service().duration.split(':').map(Number);
    const milisecondsToAdd = (hoursToAdd * 60 + minutesToAdd - offsetDate) * 60 * 1000;
    const end = new Date(new Date(start).getTime() + milisecondsToAdd);
    const appointment = {
      company_id: this.company().id,
      service_id: this.service().id,
      service: this.service().name,
      duration: this.service().duration,
      customer_id: customer.id,
      customer: customer.name,
      customer_phone: customer.phone,
      customer_email: customer.email,
      obs_customer: this.obsCustomer,
      origin: 1,
      start: start,
      end: end.toISOString(),
    }

    this.appointmentsService.addAppointment([appointment]).then((response: any) => {
      if (response.error) {
        console.log(response.error);
        this.errorCustomer = 'Erro ao confirmar agendamento, tente novamente.';
      } else {
        this.errorCustomer = '';
        localStorage.setItem('lastAppointmentCreatedAgendrix', JSON.stringify(appointment));
        this.router.navigate(['/agendamento-confirmado']);
      }
      this.isLoadingSend.set(false);
      this.cdr.detectChanges();
    });
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
