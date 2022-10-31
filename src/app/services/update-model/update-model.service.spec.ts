import { TestBed } from '@angular/core/testing';

import { UpdateModelService } from './update-model.service';

describe('UpdateModelService', () => {
  let service: UpdateModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
