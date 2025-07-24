import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  company: WritableSignal<any> = signal({});

  constructor(
    private readonly title: Title,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {

    this.route.data.subscribe((result) => {
      console.log('Resolver result:', result);
      this.company.set(result['company']?.data[0] ?? {});
      this.title.setTitle(this.company().name || 'Home');
    });

  }

}
