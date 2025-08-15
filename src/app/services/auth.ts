import { Injectable } from '@angular/core';

import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private readonly supabase: Supabase) { }

  setSession(session: any): Promise<any> {
    return this.supabase.sb.auth.setSession(session);
  }

  getSession(): Promise<any> {
    return this.supabase.sb.auth.getSession();
  }

  singOut(): Promise<any> {
    return this.supabase.sb.auth.signOut();
  }

}
