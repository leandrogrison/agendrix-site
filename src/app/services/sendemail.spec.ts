import { TestBed } from '@angular/core/testing';

import { Sendemail } from './sendemail';

describe('Sendemail', () => {
  let service: Sendemail;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sendemail);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
