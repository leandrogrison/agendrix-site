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
    console.log('Window:', window.location.hostname);
    let domain = '';
    if (window.location.hostname === 'localhost') {
      domain = 'demo';
    }
    return this.company.getCompanyByDomain(domain);
  }
}
