import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta, SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { provideNgxMask, NgxMaskPipe } from 'ngx-mask';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Error } from '../error/error';

import { Services } from '../../services/services';

@Component({
  selector: 'app-home',
  imports: [
    Error,
    RouterLink,
    CommonModule,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask()],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  company: WritableSignal<any> = signal({});
  services: WritableSignal<any> = signal([]);
  theme: WritableSignal<string> = signal('gray');
  colorType: WritableSignal<number> = signal(0);
  mapUrl!: SafeResourceUrl;
  error: boolean = false;
  days: string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  openingHours: WritableSignal<any> = signal({});
  places: WritableSignal<any> = signal([]);
  currentYear: number = new Date().getFullYear();
  showMenu: boolean = false;

  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
    private readonly route: ActivatedRoute,
    private readonly sanitizer: DomSanitizer,
    private readonly servicesService: Services
  ) {
  }

  ngOnInit(): void {

    this.route.data.subscribe((result) => {
      console.log('Resolver result:', result);
      this.company.set(result['company']?.data[0] ?? {});
      this.services.set(result['services']?.data ?? []);
      if (Object.keys(this.company()).length === 0) {
        this.error = true;
      } else {
        this.setInitial();
      }

    });

  }

  setInitial() {
    const title = this.company().name || 'Home';
    const description = this.company().description.replaceAll('\n', ' ').substring(0, 200) || 'Faça seu agendamento online conosco agora mesmo.';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.addTags([
      { property: 'og:locale', content: 'pt_BR' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:site_name', content: title },
    ]);
    this.theme.set(this.company().site_setup.color || 'gray');
    this.colorType.set(this.company().site_setup.colorType || 0);
    this.openingHours.set(this.company().opening_hours || {});
    this.places.set(this.company().places || []);

    if (this.places().length > 0) {
      this.setAddress(
        this.places()[0].street + ', ' +
        this.places()[0].number + ', ' +
        this.places()[0].neighborhood + ', ' +
        this.places()[0].city + ', ' +
        this.places()[0].state);
    }
  }

  setAddress(address: string) {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }


}
