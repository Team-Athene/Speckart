import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRouterComponent } from './user-router.component';

describe('UserRouterComponent', () => {
  let component: UserRouterComponent;
  let fixture: ComponentFixture<UserRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
