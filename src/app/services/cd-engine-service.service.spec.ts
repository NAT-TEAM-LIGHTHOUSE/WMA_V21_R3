import { TestBed } from '@angular/core/testing';

import { CdEngineServiceService } from './cd-engine-service.service';

describe('CdEngineServiceService', () => {
  let service: CdEngineServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CdEngineServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
