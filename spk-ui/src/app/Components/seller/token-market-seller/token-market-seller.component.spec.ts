import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenMarketSellerComponent } from './token-market-seller.component';

describe('TokenMarketSellerComponent', () => {
  let component: TokenMarketSellerComponent;
  let fixture: ComponentFixture<TokenMarketSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenMarketSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenMarketSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
