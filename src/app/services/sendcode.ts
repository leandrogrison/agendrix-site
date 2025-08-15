import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Sendcode {

  sendCode(phone: string): Promise<any> {
    return fetch('https://qtkytnwegxnhyylckzao.supabase.co/functions/v1/sendCodeAppointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone
      }),
    })
  }

}
