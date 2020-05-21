import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenMarketAdminComponent } from './token-market-admin.component';

describe('TokenMarketAdminComponent', () => {
  let component: TokenMarketAdminComponent;
  let fixture: ComponentFixture<TokenMarketAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenMarketAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenMarketAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
