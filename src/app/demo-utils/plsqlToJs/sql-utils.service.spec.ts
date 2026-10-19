import { TestBed } from '@angular/core/testing';

import { SqlUtilsService } from './sql-utils.service';

describe('SqlUtilsService', () => {
  let service: SqlUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
