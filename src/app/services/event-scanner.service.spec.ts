import { TestBed } from '@angular/core/testing';

import { EventScannerService } from './event-scanner.service';

describe('EventScannerService', () => {
  let service: EventScannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventScannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
