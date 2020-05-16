import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSummeryComponent } from './account-summery.component';

describe('AccountSummeryComponent', () => {
  let component: AccountSummeryComponent;
  let fixture: ComponentFixture<AccountSummeryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSummeryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
