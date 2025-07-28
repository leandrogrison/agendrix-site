import { Injectable } from '@angular/core';

import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class Company {

  constructor(private readonly supabase: Supabase) { }

  getCompany(id: string): Promise<any> {
    return this.supabase.sb
      .from('companies')
      .select('*')
      .eq('id', id);
  }

  getCompanyByDomain(domain: string): Promise<any> {
    return this.supabase.sb
      .from('companies')
      .select('*')
      .eq('domain', domain);
  }

  getCompanyBySubdomain(subdomain: string): Promise<any> {
    return this.supabase.sb
      .from('companies')
      .select('*')
      .eq('subdomain', subdomain);
  }
}
