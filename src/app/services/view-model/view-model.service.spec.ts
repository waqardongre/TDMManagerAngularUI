import { TestBed } from '@angular/core/testing';

import { ViewModelService } from './view-model.service';

describe('ViewModelService', () => {
  let service: ViewModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
