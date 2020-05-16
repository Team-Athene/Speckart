import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenMarketComponent } from './token-market.component';

describe('TokenMarketComponent', () => {
  let component: TokenMarketComponent;
  let fixture: ComponentFixture<TokenMarketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenMarketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
