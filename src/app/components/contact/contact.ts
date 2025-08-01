import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';

import { Sendemail } from '../../services/sendemail';

@Component({
  selector: 'app-contact',
  imports: [
    FormsModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {

  name: string = '';
  phone: string = '';
  message: string = '';
  isLoading: boolean = false;
  result: string = '';
  resultError: boolean = false;
  submited: boolean = false;


  constructor(
    private readonly sendEmailService: Sendemail,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  @Input() company: any;
  @ViewChild('formContact') formContact!: NgForm;

  verifyFilled(e: any) {
    if (e.target.value.length > 0) {
      e.target.classList.add('filled');
    } else {
      e.target.classList.remove('filled');
    }
  }

  verifyContact() {
    this.submited = true;

    if (this.formContact.invalid) return;

    this.isLoading = true;
    this.result = '';
    this.resultError = false;

    this.sendEmail();
  }

  sendEmail() {
    const from = 'leandro.grison@grisondesign.com.br';
    const to = this.company.email;
    const subject = 'Contato recebido do seu site';
    const html = `<p><small>Nome do contato:</small><br>
                  <b>${this.name}</b></p>
                  <p><small>Telefone do contato:</small><br>
                  <b>${this.phone}</b></p>
                  <p><small>Mensagem:</small><br>
                  ${this.message}</p><br><br>
                  <p><small>E-mail enviado do seu site desenvolvimento por <a href="https://agendrix.com.br">Agendrix</a></small></p>
                  `;

    this.sendEmailService.sendEmail(from, to, subject, html).then((response: any) => {
      if (response.error) {
        console.log(response.error);
        this.result = 'Erro ao enviar e-mail. Tente novamente mais tarde.'
        this.resultError = true;
      } else {
        this.result = 'E-mail enviado com sucesso!';
      }
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

}
