import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffItemComponent } from './diff-item.component';

describe('DiffItemComponent', () => {
  let component: DiffItemComponent;
  let fixture: ComponentFixture<DiffItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
