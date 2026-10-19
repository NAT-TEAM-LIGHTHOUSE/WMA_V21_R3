import { TestBed } from '@angular/core/testing';

import { DbCoordinatorService } from './db-coordinator.service';

describe('DbCoordinatorService', () => {
  let service: DbCoordinatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbCoordinatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
