import { TestBed } from '@angular/core/testing';

import { CustomErrorhandlingService } from './custom-errorhandling.service';

describe('CustomErrorhandlingService', () => {
  let service: CustomErrorhandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomErrorhandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
