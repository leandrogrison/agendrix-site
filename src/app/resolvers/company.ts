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
    return this.company.getCompany('148f6e34-18d5-413f-bf46-7941e365d600');
  }
}
