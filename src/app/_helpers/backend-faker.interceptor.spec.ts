import { TestBed } from '@angular/core/testing';

import { BackendFakerInterceptor } from './backend-faker.interceptor';

describe('BackendFakerInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BackendFakerInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BackendFakerInterceptor = TestBed.inject(BackendFakerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
