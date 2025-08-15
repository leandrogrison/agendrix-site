import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Services } from '../services/services';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicesResolver implements Resolve<any> {

  constructor(
    private readonly services: Services,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any> {
    const companyData = route.parent?.data['company'];
    const companyId = companyData?.data?.id;
    return this.services.getServices(companyId);
  }
}
