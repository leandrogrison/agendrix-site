import { Injectable } from '@angular/core';

import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class Services {

  constructor(
    private readonly supabase: Supabase
  ) { }

  getServices(companyId: string, key: string = '', page: number = 0, limit: number = 1000): Promise<any> {
    const from = page * limit;
    const to = from + limit - 1;

    return this.supabase.sb
      .from('services')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId)
      .eq('appointment_online', true)
      .ilike('name', `%${key}%`)
      .order('name', { ascending: true })
      .range(from, to)
      .is('deleted', false);
  }

  getService(id: string): Promise<any> {
    return this.supabase.sb
      .from('services')
      .select('*')
      .eq('id', id)
      .single()
      .eq('appointment_online', true)
      .is('deleted', false);
  }

}
