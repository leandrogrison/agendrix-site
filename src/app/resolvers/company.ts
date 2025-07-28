import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Company } from '../services/company';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyResolver implements Resolve<any> {

  constructor(private readonly company: Company) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any> {
    console.log('CompanyResolver activated for route:', route);
    console.log('Current state:', state.url);
    let domain = '';
    // if (location.hostname === 'localhost') {
    //   domain = 'demo';
    // }
    return this.company.getCompanyByDomain(domain);
  }
}
