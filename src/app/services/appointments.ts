import { Injectable } from '@angular/core';

import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class Appointments {

  constructor(
    private readonly supabase: Supabase
  ) { }

  getAppointments(companyId: string, dateStart: string): Promise<any> {
    let query = this.supabase.sb
      .from('appointments')
      .select('start,end')
      .gte('start', dateStart)
      .eq('company_id', companyId)
      .order('start', { ascending: true })
      .is('deleted', false);

    return query;
  }

}
