import { TestBed } from '@angular/core/testing';

import { GetWeatherService } from './get-weather.service';

describe('GetWeatherService', () => {
  let service: GetWeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetWeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
