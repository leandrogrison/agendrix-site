import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Sendemail {

  sendEmail(from: string, to: string, subject: string, html: string): Promise<any> {
    return fetch('https://qtkytnwegxnhyylckzao.supabase.co/functions/v1/resend-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    })
  }

}
