import { Injectable } from '@angular/core';

import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class Customer {

  constructor(private readonly supabase: Supabase) { }

  getCustomerByPhone(phone: string, companyId: string): Promise<any> {
    return this.supabase.sb
      .from('customers')
      .select('id,name,email,phone,created_at')
      .order('created_at', { ascending: false })
      .contains('company_id', [companyId])
      .eq('phone', phone);
  }

  addCustomer(customer: any): Promise<any> {
    return this.supabase.sb
      .from('customers')
      .insert(customer)
      .select();
  }

  updateCustomer(customer: any[]): Promise<any> {
    return this.supabase.sb
      .from('customers')
      .update({
        name: customer[0].name,
        email: customer[0].email,
      })
      .eq('id', customer[0].id )
      .select();
  }

}
