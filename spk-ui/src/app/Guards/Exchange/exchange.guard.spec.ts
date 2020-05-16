import { TestBed, async, inject } from '@angular/core/testing';

import { ExchangeGuard } from './exchange.guard';

describe('ExchangeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExchangeGuard]
    });
  });

  it('should ...', inject([ExchangeGuard], (guard: ExchangeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
