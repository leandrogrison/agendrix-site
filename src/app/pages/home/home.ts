import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Error } from '../error/error';

@Component({
  selector: 'app-home',
  imports: [
    Error
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  company: WritableSignal<any> = signal({});
  error: boolean = false;

  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {

    this.route.data.subscribe((result) => {
      console.log('Resolver result:', result);
      this.company.set(result['company']?.data[0] ?? {});
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

  }

}
