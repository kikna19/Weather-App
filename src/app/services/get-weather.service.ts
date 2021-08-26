import { Injectable } from '@angular/core';

import {HttpClient, HttpEvent, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {GoogleObj} from "../home/google";


@Injectable({
  providedIn: 'root'
})
export class GetWeatherService{

  URL: string = '';
  apiKey = 'eb298a88f081e02124bf203aaa9cb216';
  constructor(private http: HttpClient) {
    this.URL=`https://api.openweathermap.org/data/2.5/weather?appid=${this.apiKey}&q=`
  }


  getWeather(cityName: string){
   return this.http.get(`${this.URL}${cityName}`)
  }

  getFiveDaysForecast(city: string){
    return this.http.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=eb298a88f081e02124bf203aaa9cb216`)
  }

  getCityImage(city: string){
    return this.http.get(`https://api.unsplash.com/photos/random/?count=1&client_id=8e31e45f4a0e8959d456ba2914723451b8262337f75bcea2e04ae535491df16d&query=${city}`)
  }

  search(city:string) {
 return this.http.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${city}`)
  }

}
