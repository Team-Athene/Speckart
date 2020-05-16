import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenMarketComponent_User } from './token-market.component';

describe('TokenMarketComponent_User', () => {
  let component: TokenMarketComponent_User;
  let fixture: ComponentFixture<TokenMarketComponent_User>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenMarketComponent_User ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenMarketComponent_User);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
