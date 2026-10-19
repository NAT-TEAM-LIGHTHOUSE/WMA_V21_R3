import { TestBed } from '@angular/core/testing';

import { CanvasModalService } from './canvas-modal.service';

describe('CanvasModalService', () => {
  let service: CanvasModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
