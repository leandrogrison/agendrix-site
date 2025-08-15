import { TestBed } from '@angular/core/testing';

import { Sendcode } from './sendcode';

describe('Sendcode', () => {
  let service: Sendcode;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sendcode);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
