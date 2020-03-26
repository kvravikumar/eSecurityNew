import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickCodeComponent } from './quick-code.component';

describe('QuickCodeComponent', () => {
  let component: QuickCodeComponent;
  let fixture: ComponentFixture<QuickCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
