import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Captcha {

  async sendCaptcha(captcha_token: string): Promise<any> {
    const response = await fetch('https://qtkytnwegxnhyylckzao.supabase.co/functions/v1/login-anonymously', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        captcha_token
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Lança um erro com a mensagem da API ou uma mensagem padrão
      throw new Error(data.error || `A requisição falhou com o status ${response.status}`);
    }

    return data;
  }

}
