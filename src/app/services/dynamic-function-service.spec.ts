import { TestBed } from '@angular/core/testing';

import { DynamicFunctionService } from './dynamic-function-service';

describe('DynamicFunctionService', () => {
  let service: DynamicFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
