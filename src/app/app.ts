import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Company } from './services/company';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  companyName: WritableSignal<string> = signal('');

  constructor(private readonly company: Company) {
  }

  ngOnInit(): void {
    this.company.getCompany('148f6e34-18d5-413f-bf46-7941e365d600').then((result) => {
      console.log(result);
      this.companyName.set(result.data[0].name);
    }).catch((error) => {
      console.error('Error fetching company:', error);
    });
  }
}
