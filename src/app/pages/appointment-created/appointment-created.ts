import { Component, Inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, ViewportScroller, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';

import { Header } from '../../components/header/header';
import { Error } from '../error/error';
import { Whatsapp } from '../../components/whatsapp/whatsapp';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-appointment-created',
  imports: [
    CommonModule,
    RouterLink,
    Header,
    Error,
    Whatsapp,
    Footer
  ],
  templateUrl: './appointment-created.html',
  styleUrl: './appointment-created.scss'
})
export class AppointmentCreated implements OnInit {

  company: WritableSignal<any> = signal({});
  service: WritableSignal<any> = signal({});
  theme: WritableSignal<string> = signal('gray');
  colorType: WritableSignal<number> = signal(0);
  error: boolean = false;
  appointment: WritableSignal<any> = signal({});
  isLoading: WritableSignal<boolean> = signal(true);
  whatsappUrl!: SafeUrl;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly title: Title,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly viewportScroller: ViewportScroller,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((result) => {
      this.service.set(result['services']?.data ?? {});
      this.company.set(result['company']?.data ?? {});
      if (Object.keys(this.company()).length === 0) {
        this.error = true;
      } else {
        this.setInitial();
      }
    });
  }

  setInitial() {
    const title = 'Agendamento confirmado - ' + this.company().name;

    this.title.setTitle(title);
    this.theme.set(this.company().site_setup.color || 'gray');
    this.colorType.set(this.company().site_setup.colorType || 0);

    if (isPlatformBrowser(this.platformId)) {
      this.appointment.set(JSON.parse(localStorage.getItem('lastAppointmentCreatedAgendrix') ?? '{}'));
      this.viewportScroller.scrollToPosition([0, 0]);
      const phone = this.company().phone.replace(/\D/g, '');
      const url = `https://wa.me/55${phone}`;
      this.whatsappUrl = this.sanitizer.bypassSecurityTrustUrl(url);
      this.isLoading.set(false);
    }
  }

}
