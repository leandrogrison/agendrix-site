import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Company } from '../services/company';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyResolver implements Resolve<any> {

  constructor(
    private readonly company: Company,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any> {
    console.log('CompanyResolver activated for route:', route);
    const window = this.document.defaultView as Window;
    const hostname = window.location.hostname;
    console.log('Window:', window.location.hostname);

    if (hostname === 'localhost') {
      return this.company.getCompanyByDomain('demo');
    } else if (hostname.indexOf('agendrix') > 0) {
      const parts = hostname.split('.');
      const subdomain = parts.length > 2 ? parts[0] : '';
      return this.company.getCompanyBySubdomain(subdomain);
    } else {
      const parts = hostname.split('.');
      const domain = parts.length > 2 ? parts.slice(-2).join('.') : '';
      return this.company.getCompanyByDomain(domain);
    }

  }
}
