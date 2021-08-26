import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GetWeatherService} from "../services/get-weather.service";
import {FormControl, FormGroup} from "@angular/forms";

import {faTemperatureHigh} from "@fortawesome/free-solid-svg-icons";
import {faTemperatureLow} from "@fortawesome/free-solid-svg-icons";
import {faTint} from "@fortawesome/free-solid-svg-icons";
import {BehaviorSubject, Subscription, timer} from "rxjs";
import {map, share} from "rxjs/operators";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {CityInfoComponent} from "./city-info/city-info.component";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import {GoogleTranslateService} from "../services/google-translate.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  cityLocation: string = '';
  country!: string;
  cityWeather!: any;
  img!: any;
  cityDes!: string;
  tempLow = faTemperatureLow;
  tempHigh = faTemperatureHigh;
  tint = faTint;
  windDeg!: string;
  tempMin!: any;
  tempMax!: any;
  humidity!: any;
  sunRise!: any;
  sunSet!: any;
  windSpeed!: number;
  currentTime = new Date();
  subscription!: Subscription;
  currentCity: string = 'tbilisi';
  imgUrl!: string;
  cityTime!: any;
  localTime = new Date();
  localGetTime = this.localTime.getTime();
  localGetOffset = this.localTime.getTimezoneOffset() * 60000;
  utc = this.localGetTime + this.localGetOffset
  cityUtc = this.utc + (3600000 * this.cityTime);
  currentCityTime!: any;
  minutes!: any;
  info = faInfoCircle;
  cityHeader!: string;
  cityInfo!: string;
  selected = 'en';

  forecastDate!: string;
  forecastDateOne!: string;
  forecastDateTwo!: string;
  forecastDateThree!: string;
  forecastDateFour!: string;

  forecastTimeOneTemp!: number;
  forecastTimeOneImg!: string;

  forecastTimeOneTempS!: number
  forecastTimeOneImgS!: string;


  forecastTimeOneTempT!: number;
  forecastTimeOneImgT!: string;

  forecastTimeOneTempF!: number;
  forecastTimeOneImgF!: string;

  forecastTimeOneTempFi!: number;
  forecastTimeOneImgFi!: string;

  translate: any[] = [];
  cityLocationOne!: string;
  countryOne!: string;
  cityDesOne!: string;



  cityLabelOne = 'city';
  fiveDaysHeader = 'five days forecast';
  cityOne = 'city: ';
  local = 'local: ';
  windSpeedOne = ' KM/H';
  translateLocalOne: any [] = [];

  cityInfoOne!: string;
  cityInfoHeaderOne!: string;
  translateInfo: any [] = [];

  forecastTwoDate = new Date().getDay() + 1;
  forecastThreeDate = new Date().getDay() + 2;
  forecastFourDate = new Date().getDay() + 3;
  forecastFiveDate = new Date().getDay() + 4;

  fiveForecastDays: string [] = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  fiveForecastDaysOne = 'Today';
  fiveForecastDaysTwo = this.fiveForecastDays[this.forecastTwoDate];
  fiveForecastDaysThree = this.fiveForecastDays[this.forecastThreeDate];
  fiveForecastDaysFour = this.fiveForecastDays[this.forecastFourDate];
  fiveForecastDaysFive = this.fiveForecastDays[this.forecastFiveDate];


  fiveForecastDaysTranslate: string [] = [this.fiveForecastDaysOne, this.fiveForecastDaysTwo, this.fiveForecastDaysThree, this.fiveForecastDaysFour, this.fiveForecastDaysFive]
  fiveForecastDaysOneTranslate!: string;
  fiveForecastDaysTwoTranslate!: string;
  fiveForecastDaysThreeTranslate!: string;
  fiveForecastDaysFourTranslate!: string;
  fiveForecastDaysFiveTranslate!: string;

  gela = 'rs'


  mako = new BehaviorSubject(localStorage.getItem(this.gela)??"value");



  en: string = '';
  enLocal: string = '';
  enInfo: string = '';
  enForecast: string = 'en';




  constructor(private ws: GetWeatherService, private gs: GoogleTranslateService, private sheet: MatBottomSheet) {
  }

  group = new FormGroup({
    cityName: new FormControl('')
  })


  ngOnInit() {



    this.mako.subscribe(res  =>{
      localStorage.setItem(res, this.fiveForecastDaysOneTranslate)
    })

    this.gs.translateForecast(this.fiveForecastDaysTranslate, this.enForecast).subscribe(res => {
      this.fiveDaysTranslate(res);

    })

    this.translateLocalEn();

    setInterval(() => {
      this.minutes = new Date();
    }, .1)

    this.ws.getFiveDaysForecast('tbilisi').subscribe(res => {
      this.fiveDaysForeCast(res);
    })


    this.ws.search(this.currentCity).subscribe(res => {
      this.getCityInfo(res);
    })

    this.ws.getCityImage(this.currentCity).subscribe(data => {
      this.getCityByImage(data);
    })

    this.ws.getWeather(this.currentCity).subscribe(data => {
        this.getWeatherByCityName(data);
        this.convertTime(data);
      }
    );
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      ).subscribe(timer => {
        this.currentTime = timer;
      })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  openSheet() {
    this.sheet.open(CityInfoComponent, {
      data: {header: this.cityInfoOne, info: this.cityInfoHeaderOne}
    })
  }


  onSubmit(cityName: HTMLInputElement) {

    this.ws.getFiveDaysForecast(cityName.value).subscribe(data => {
      this.fiveDaysForeCast(data)
    })

    this.ws.search(cityName.value).subscribe(data => {
      this.getCityInfo(data);
    })

    this.ws.getCityImage(cityName.value).subscribe(data => {
      this.getCityByImage(data);

    })
    this.ws.getWeather(cityName.value).subscribe(data => {
      this.getWeatherByCityName(data);
      this.convertTime(data);
    })
    cityName.value = '';
  }

  getCityByImage(city: any) {
    this.imgUrl = city[0].urls.regular;
  }


  getWeatherByCityName(city: any) {


    if (city.wind.deg > 0 && city.wind.deg <= 55) {
      this.windDeg = 'NE'
    }
    if (city.wind.deg > 55 && city.wind.deg <= 90) {
      this.windDeg = 'E'
    }
    if (city.wind.deg > 90 && city.wind.deg <= 125) {
      this.windDeg = 'SE'
    }
    if (city.wind.deg > 125 && city.wind.deg <= 180) {
      this.windDeg = 'S'
    }
    if (city.wind.deg > 180 && city.wind.deg <= 225) {
      this.windDeg = 'SW'
    }
    if (city.wind.deg > 225 && city.wind.deg <= 270) {
      this.windDeg = 'W'
    }
    if (city.wind.deg > 270 && city.wind.deg <= 315) {
      this.windDeg = 'NW'
    }
    if (city.wind.deg > 315 && city.wind.deg <= 360) {
      this.windDeg = 'N'
    }
    if (this.en == '') {
      this.en = 'en';
      this.cityLocation = city.name;
      this.country = city.sys.country;
      this.cityWeather = city.main.feels_like;
      this.img = city.weather[0].icon;
      this.cityDes = city.weather[0].main;
      this.tempMin = city.main.temp_min;
      this.tempMax = city.main.temp_max;
      this.humidity = city.main.humidity;
      this.sunRise = new Date(city.sys.sunrise * 1000);
      this.sunSet = new Date(city.sys.sunset * 1000);
      this.windSpeed = city.wind.speed * 3.6;
      if (this.en == 'en') {
        this.translate = [this.cityLocation, this.country, this.cityDes]
        this.gs.translateEn(this.translate, this.en).subscribe(res => {
          this.translateWeatherItems(res)
        })
      }
    }
    if (this.en == 'ru') {
      this.cityLocation = city.name;
      this.country = city.sys.country;
      this.cityWeather = city.main.feels_like;
      this.img = city.weather[0].icon;
      this.cityDes = city.weather[0].main;
      this.tempMin = city.main.temp_min;
      this.tempMax = city.main.temp_max;
      this.humidity = city.main.humidity;
      this.sunRise = new Date(city.sys.sunrise * 1000);
      this.sunSet = new Date(city.sys.sunset * 1000);
      this.windSpeed = city.wind.speed * 3.6;
      this.translate = [this.cityLocation, this.country, this.cityDes]
      this.gs.translate(this.translate, this.en).subscribe(res => {
        this.translateWeatherItems(res)
      })
    }
    if (this.en == 'fr') {
      this.cityLocation = city.name;
      this.country = city.sys.country;
      this.cityWeather = city.main.feels_like;
      this.img = city.weather[0].icon;
      this.cityDes = city.weather[0].main;
      this.tempMin = city.main.temp_min;
      this.tempMax = city.main.temp_max;
      this.humidity = city.main.humidity;
      this.sunRise = new Date(city.sys.sunrise * 1000);
      this.sunSet = new Date(city.sys.sunset * 1000);
      this.windSpeed = city.wind.speed * 3.6;
      this.translate = [this.cityLocation, this.country, this.cityDes]
      this.gs.translate(this.translate, this.en).subscribe(res => {
        this.translateWeatherItems(res)
      })
    }
    if (this.en == 'de') {
      this.cityLocation = city.name;
      this.country = city.sys.country;
      this.cityWeather = city.main.feels_like;
      this.img = city.weather[0].icon;
      this.cityDes = city.weather[0].main;
      this.tempMin = city.main.temp_min;
      this.tempMax = city.main.temp_max;
      this.humidity = city.main.humidity;
      this.sunRise = new Date(city.sys.sunrise * 1000);
      this.sunSet = new Date(city.sys.sunset * 1000);
      this.windSpeed = city.wind.speed * 3.6;
      this.translate = [this.cityLocation, this.country, this.cityDes]
      this.gs.translate(this.translate, this.en).subscribe(res => {
        this.translateWeatherItems(res)
      })
    }
    if (this.en == 'es') {
      this.cityLocation = city.name;
      this.country = city.sys.country;
      this.cityWeather = city.main.feels_like;
      this.img = city.weather[0].icon;
      this.cityDes = city.weather[0].main;
      this.tempMin = city.main.temp_min;
      this.tempMax = city.main.temp_max;
      this.humidity = city.main.humidity;
      this.sunRise = new Date(city.sys.sunrise * 1000);
      this.sunSet = new Date(city.sys.sunset * 1000);
      this.windSpeed = city.wind.speed * 3.6;
      this.translate = [this.cityLocation, this.country, this.cityDes]
      this.gs.translate(this.translate, this.en).subscribe(res => {
        this.translateWeatherItems(res)
      })
    }
    if (this.en == 'en') {
      this.cityLocation = city.name;
      this.country = city.sys.country;
      this.cityWeather = city.main.feels_like;
      this.img = city.weather[0].icon;
      this.cityDes = city.weather[0].main;
      this.tempMin = city.main.temp_min;
      this.tempMax = city.main.temp_max;
      this.humidity = city.main.humidity;
      this.sunRise = new Date(city.sys.sunrise * 1000);
      this.sunSet = new Date(city.sys.sunset * 1000);
      this.windSpeed = city.wind.speed * 3.6;
      this.translate = [this.cityLocation, this.country, this.cityDes]
      this.gs.translate(this.translate, this.en).subscribe(res => {
        this.translateWeatherItems(res)
      })
    }
  }


  fiveDaysForeCast(day: any) {
    this.forecastDate = day.list[0].dt_txt;
    this.forecastDateOne = day.list[8].dt_txt;
    this.forecastDateTwo = day.list[16].dt_txt;
    this.forecastDateThree = day.list[24].dt_txt;
    this.forecastDateFour = day.list[32].dt_txt;
    this.forecastTimeOneTemp = day.list[0].main.feels_like - 273.15;
    this.forecastTimeOneImg = day.list[0].weather[0].icon;
    this.forecastTimeOneTempS = day.list[8].main.feels_like - 273.15;
    this.forecastTimeOneImgS = day.list[8].weather[0].icon;
    this.forecastTimeOneTempT = day.list[16].main.feels_like - 273.15;
    this.forecastTimeOneImgT = day.list[16].weather[0].icon;
    this.forecastTimeOneTempF = day.list[24].main.feels_like - 273.15;
    this.forecastTimeOneImgF = day.list[24].weather[0].icon;
    this.forecastTimeOneTempFi = day.list[32].main.feels_like - 273.15;
    this.forecastTimeOneImgFi = day.list[32].weather[0].icon;
  }


  fiveDaysTranslate(data: any) {
    this.fiveForecastDaysOneTranslate = data[0].translations[0].text;
    this.fiveForecastDaysTwoTranslate = data[1].translations[0].text;
    this.fiveForecastDaysThreeTranslate = data[2].translations[0].text;
    this.fiveForecastDaysFourTranslate = data[3].translations[0].text;
    this.fiveForecastDaysFiveTranslate = data[4].translations[0].text;

  }



  getCityInfo(city: any) {
    this.cityHeader = city.description;
    this.cityInfo = city.extract;
    if (this.enInfo == '') {
      this.enInfo = 'en'
      this.cityHeader = city.description;
      this.cityInfo = city.extract;
      this.translateInfo = [this.cityHeader, this.cityInfo];
      this.gs.translateInfo(this.translateInfo, this.enInfo).subscribe(res => {
        this.translateInfoItems(res);
      })
    }
    if (this.enInfo == 'en') {
      this.enInfo = 'en'
      this.cityHeader = city.description;
      this.cityInfo = city.extract;
      this.translateInfo = [this.cityHeader, this.cityInfo];
      this.gs.translateInfo(this.translateInfo, this.enInfo).subscribe(res => {
        this.translateInfoItems(res);
      })
    }
    if (this.enInfo == 'ru') {
      this.enInfo = 'ru';
      this.cityHeader = city.description;
      this.cityInfo = city.extract;
      this.translateInfo = [this.cityHeader, this.cityInfo];
      this.gs.translateInfo(this.translateInfo, this.enInfo).subscribe(res => {
        this.translateInfoItems(res);
      })
    }
    if (this.enInfo == 'fr') {
      this.enInfo = 'fr';
      this.cityHeader = city.description;
      this.cityInfo = city.extract;
      this.translateInfo = [this.cityHeader, this.cityInfo];
      this.gs.translateInfo(this.translateInfo, this.enInfo).subscribe(res => {
        this.translateInfoItems(res);
      })
    }
    if (this.enInfo == 'de') {
      this.enInfo = 'de';
      this.cityHeader = city.description;
      this.cityInfo = city.extract;
      this.translateInfo = [this.cityHeader, this.cityInfo];
      this.gs.translateInfo(this.translateInfo, this.enInfo).subscribe(res => {
        this.translateInfoItems(res);
      })
    }
    if (this.enInfo == 'es') {
      this.enInfo = 'es';
      this.cityHeader = city.description;
      this.cityInfo = city.extract;
      this.translateInfo = [this.cityHeader, this.cityInfo];
      this.gs.translateInfo(this.translateInfo, this.enInfo).subscribe(res => {
        this.translateInfoItems(res);
      })
    }
  }

  translateInfoItems(data: any) {
    this.cityInfoOne = data[0].translations[0].text;
    this.cityInfoHeaderOne = data[1].translations[0].text;
  }

  translateWeatherItems(data: any) {
    this.cityLocationOne = data[0].translations[0].text + ', '
    this.countryOne = data[1].translations[0].text;
    this.cityDesOne = data[2].translations[0].text;
  }

  translateLocalItems(data: any) {
    this.cityLabelOne = data[0].translations[0].text;
    this.fiveDaysHeader = data[1].translations[0].text;
    this.cityOne = data[2].translations[0].text;
    this.local = data[3].translations[0].text;
    this.windSpeedOne = data[4].translations[0].text;
  }

  translateForecastRu() {
    this.enForecast = 'ru';
    this.fiveForecastDaysTranslate = [this.fiveForecastDaysOne, this.fiveForecastDaysTwo, this.fiveForecastDaysThree, this.fiveForecastDaysFour, this.fiveForecastDaysFive];
    this.gs.translateForecast(this.fiveForecastDaysTranslate, this.enForecast).subscribe(res => {
      this.fiveDaysTranslate(res);
    })
  }

  translateForecastFr() {
    this.enForecast = 'fr';
    this.fiveForecastDaysTranslate = [this.fiveForecastDaysOne, this.fiveForecastDaysTwo, this.fiveForecastDaysThree, this.fiveForecastDaysFour, this.fiveForecastDaysFive];
    this.gs.translateForecast(this.fiveForecastDaysTranslate, this.enForecast).subscribe(res => {
      this.fiveDaysTranslate(res)
    })
  }

  translateForecastGer() {
    this.enForecast = 'de';
    this.fiveForecastDaysTranslate = [this.fiveForecastDaysOne, this.fiveForecastDaysTwo, this.fiveForecastDaysThree, this.fiveForecastDaysFour, this.fiveForecastDaysFive];
    this.gs.translateForecast(this.fiveForecastDaysTranslate, this.enForecast).subscribe(res => {
      this.fiveDaysTranslate(res)
    })
  }

  translateForecastEsp() {
    this.enForecast = 'es';
    this.fiveForecastDaysTranslate = [this.fiveForecastDaysOne, this.fiveForecastDaysTwo, this.fiveForecastDaysThree, this.fiveForecastDaysFour, this.fiveForecastDaysFive];
    this.gs.translateForecast(this.fiveForecastDaysTranslate, this.enForecast).subscribe(res => {
      this.fiveDaysTranslate(res)
    })
  }

  translateForecastEng() {
    this.enForecast = 'en';
    this.fiveForecastDaysTranslate = [this.fiveForecastDaysOne, this.fiveForecastDaysTwo, this.fiveForecastDaysThree, this.fiveForecastDaysFour, this.fiveForecastDaysFive];
    this.gs.translateForecast(this.fiveForecastDaysTranslate, this.enForecast).subscribe(res => {
      this.fiveDaysTranslate(res)
    })
  }


  translateInfoRu() {
    this.enInfo = 'ru';
    this.gs.translateInfo(this.translateInfo, this.enInfo).subscribe(res => {
      this.translateInfoItems(res);

    })
  }

  translateInfoFr() {
    this.enInfo = 'fr';
    this.gs.translateInfo(this.translateInfo, this.enInfo).subscribe(res => {
      this.translateInfoItems(res);
    })
  }

  translateInfoGer() {
    this.enInfo = 'de';
    this.gs.translateInfo(this.translateInfo, this.enInfo).subscribe(res => {
      this.translateInfoItems(res)
    })

  }

  translateInfoEsp() {
    this.enInfo = 'es';
    this.gs.translateInfo(this.translateInfo, this.enInfo).subscribe(res => {
      this.translateInfoItems(res)
    })
  }

  translateInfoEng() {
    this.enInfo = 'en';
    this.gs.translateInfo(this.translateInfo, this.enInfo).subscribe(res => {
      this.translateInfoItems(res)
    })
  }


  translateRu() {
    this.en = 'ru';
    this.gs.translate(this.translate, this.en).subscribe(res => {
      this.translateWeatherItems(res);
     localStorage.getItem('fa')
    })
    this.translateLocalRu();
    this.translateInfoRu();
    this.translateForecastRu();

  }

  translateFr() {
    this.en = 'fr';
    this.gs.translate(this.translate, this.en).subscribe(res => {
      this.translateWeatherItems(res)
    })
    this.translateLocalFr();
    this.translateInfoFr();
    this.translateForecastFr();

  }

  translateGer() {
    this.en = 'de';
    this.gs.translate(this.translate, this.en).subscribe(res => {
      this.translateWeatherItems(res)
    })
    this.translateLocalGer();
    this.translateInfoGer();
    this.translateForecastGer();

  }

  translateEsp() {
    this.en = 'es';
    this.gs.translate(this.translate, this.en).subscribe(res => {
      this.translateWeatherItems(res)
    })
    this.translateLocalEsp();
    this.translateInfoEsp();
    this.translateForecastEsp();
  }

  translateEng() {
    this.en = 'en';
    this.gs.translate(this.translate, this.en).subscribe(res => {
      this.translateWeatherItems(res)
    })
    this.translateLocalEng();
    this.translateInfoEng();
    this.translateForecastEng();
  }


  translateLocalEn() {
    if (this.enLocal == '') {
      this.enLocal = 'en';
      this.translateLocalOne = [this.cityLabelOne, this.fiveDaysHeader, this.cityOne, this.local, this.windSpeedOne]
      this.gs.translateLocalEn(this.translateLocalOne, this.enLocal).subscribe(res => {
        this.translateLocalItems(res)
      })
    }
  }

  translateLocalRu() {
    this.enLocal = 'ru';
    this.translateLocalOne = ['city', 'five days forecast', 'city: ', 'local: ', ' KM/H']
    this.gs.translateLocalLang(this.translateLocalOne, this.enLocal).subscribe(res => {
      this.translateLocalItems(res)

    })
  }

  translateLocalFr() {
    this.enLocal = 'fr';
    this.translateLocalOne = ['city', 'five days forecast', 'city: ', 'local: ', ' KM/H']
    this.gs.translateLocalLang(this.translateLocalOne, this.enLocal).subscribe(res => {
      this.translateLocalItems(res)
    })
  }

  translateLocalGer() {
    this.enLocal = 'de'
    this.translateLocalOne = ['city', 'five days forecast', 'city: ', 'local: ', ' KM/H']
    this.gs.translateLocalLang(this.translateLocalOne, this.enLocal).subscribe(res => {
      this.translateLocalItems(res)
    })
  }

  translateLocalEsp() {
    this.enLocal = 'es'
    this.translateLocalOne = ['city', 'five days forecast', 'city: ', 'local: ', ' KM/H']
    this.gs.translateLocalLang(this.translateLocalOne, this.enLocal).subscribe(res => {
      this.translateLocalItems(res)
    })
  }

  translateLocalEng() {
    this.enLocal = 'en';
    this.translateLocalOne = ['city', 'five days forecast', 'city: ', 'local: ', ' KM/H']
    this.gs.translateLocalLang(this.translateLocalOne, this.enLocal).subscribe(res => {
      this.translateLocalItems(res)
    })
  }

  convertTime(city:any) {
    if (city.timezone == -43200) {
      this.cityTime = -12;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }
    if (city.timezone == -39600) {
      this.cityTime = -11;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }

    if (city.timezone == -36000) {
      this.cityTime = -10;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }

    if (city.timezone == -34200) {
      this.cityTime = -9.5;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }

    if (city.timezone == -32400) {
      this.cityTime = -9;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }

    if (city.timezone == -28800) {
      this.cityTime = -8;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }
    if (city.timezone == -25200) {
      this.cityTime = -7;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }

    if (city.timezone == -21600) {
      this.cityTime = -6;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }
    if (city.timezone == -18000) {
      this.cityTime = -5;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }
    if (city.timezone == -16200) {
      this.cityTime = -4.5;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }

    if (city.timezone == -14400) {
      this.cityTime = -4;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();

    }

    if (city.timezone == -12600) {
      this.cityTime = -3.5;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }

    if (city.timezone == -10800) {
      this.cityTime = -3;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }
    if (city.timezone == -7200) {
      this.cityTime = -2;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }
    if (city.timezone == -3600) {
      this.cityTime = -1;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }
    if (city.timezone == 0) {
      this.cityTime = 0;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }
    if (city.timezone == 3600) {
      this.cityTime = 1;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }

    if (city.timezone == 7200) {
      this.cityTime = 2;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();

    }
    if (city.timezone == 10800) {
      this.cityTime = 3;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }

  if (city.timezone == 12600) {
    this.cityTime = 3.5;
    this.cityUtc = this.utc + (3600000 * this.cityTime);
    this.currentCityTime = new Date(this.cityUtc).toLocaleString();
  }

    if (city.timezone == 16200) {
      this.cityTime = 3;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }
    if (city.timezone == 14400) {
      this.cityTime = 4;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }

    if (city.timezone == 18000) {
      this.cityTime = 5;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }
    if (city.timezone == 19800) {
      this.cityTime = 5.5;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();

    }
    if (city.timezone == 20700) {
      this.cityTime = 5.75;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();

    }

    if (city.timezone == 21600) {
      this.cityTime = 6;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }


    if (city.timezone == 23400) {
      this.cityTime = 6.5;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }

    if (city.timezone == 25200) {
      this.cityTime = 7;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }

    if (city.timezone == 28800) {
      this.cityTime = 8;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }


    if (city.timezone == 32400) {
      this.cityTime = 9;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }


    if (city.timezone == 34200) {
      this.cityTime = 9.5;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString()
    }
    if (city.timezone == 36000) {
      this.cityTime = 10;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString()

    }
    if (city.timezone == 37800) {
      this.cityTime = 10.5;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString()
    }

    if (city.timezone == 39600) {
      this.cityTime = 11;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString()
    }

    if (city.timezone == 41400) {
      this.cityTime = 11.5;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString()

    }

    if (city.timezone == 43200) {
      this.cityTime = 12;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString()
    }

    if (city.timezone == 45900) {
      this.cityTime = 12.75;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString()

    }

    if (city.timezone == 46800) {
      this.cityTime = 13;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString()
    }

    if (city.timezone == 50400) {
      this.cityTime = 14;
      this.cityUtc = this.utc + (3600000 * this.cityTime);
      this.currentCityTime = new Date(this.cityUtc).toLocaleString();
    }
  }
}
