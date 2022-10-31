import { TestBed } from '@angular/core/testing';

import { ModelsListService } from './models-list.service';

describe('ModelsListService', () => {
  let service: ModelsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
