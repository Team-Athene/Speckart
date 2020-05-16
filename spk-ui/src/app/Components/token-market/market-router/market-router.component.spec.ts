import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketRouterComponent } from './market-router.component';

describe('MarketRouterComponent', () => {
  let component: MarketRouterComponent;
  let fixture: ComponentFixture<MarketRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
