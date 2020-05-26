import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerRouterComponent } from './seller-router.component';

describe('SellerRouterComponent', () => {
  let component: SellerRouterComponent;
  let fixture: ComponentFixture<SellerRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
