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

  addAppointment(appointment: any): Promise<any> {
    return this.supabase.sb
      .from('appointments')
      .insert(appointment)
      .select();
  }

}
