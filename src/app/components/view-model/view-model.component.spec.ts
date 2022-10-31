import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModelComponent } from './view-model.component';

describe('ViewModelComponent', () => {
  let component: ViewModelComponent;
  let fixture: ComponentFixture<ViewModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
