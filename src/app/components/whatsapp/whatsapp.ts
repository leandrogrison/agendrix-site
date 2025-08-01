import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-whatsapp',
  imports: [CommonModule],
  templateUrl: './whatsapp.html',
  styleUrl: './whatsapp.scss'
})
export class Whatsapp implements OnInit {

  @Input() company: any;

  whatsappUrl!: SafeUrl;

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.company?.phone) {
      const phone = this.company.phone.replace(/\D/g, '');
      const url = `https://wa.me/55${phone}?text=Olá!%20Gostaria%20de%20mais%20informações%20sobre%20seus%20serviços.`;
      this.whatsappUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    }
  }
}
