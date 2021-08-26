import {Injectable} from '@angular/core';
import {GoogleObj} from "../home/google";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class GoogleTranslateService{

  constructor(private http: HttpClient) {

  }
  translateEn(text:any[] = [],en:string) {
    const headers =
      new HttpHeaders({
        'Ocp-Apim-Subscription-Key': '1760963c119d4ae184420072b8c461ed',
        'Ocp-Apim-Subscription-Region': 'westeurope',
        'Content-Type': 'application/json',
      })

    return this.http.post(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${en}&to=${en}`, [{'text': text[0]},{'text': text[1]},{'text': text[2]}], {headers: headers});
  }
  translate(text:any[] = [],lang:string) {
    const headers =
      new HttpHeaders({
        'Ocp-Apim-Subscription-Key': '1760963c119d4ae184420072b8c461ed',
        'Ocp-Apim-Subscription-Region': 'westeurope',
        'Content-Type': 'application/json',
      })

    return this.http.post(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${lang}`, [{'text': text[0]}, {'text': text[1]},{'text': text[2]}], {headers: headers});

  }
  translateLocalEn(text:any[] = [],en:string,) {

    const headers =
      new HttpHeaders({
        'Ocp-Apim-Subscription-Key': '1760963c119d4ae184420072b8c461ed',
        'Ocp-Apim-Subscription-Region': 'westeurope',
        'Content-Type': 'application/json',
      })

    return this.http.post(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${en}&to=${en}`, [{'text': text[0]},{'text': text[1]},{'text': text[2]},{'text': text[3]},{'text': text[4]}], {headers: headers});
  }
  translateLocalLang(text:any[] = [],lang:string) {
    const headers =
      new HttpHeaders({
        'Ocp-Apim-Subscription-Key': '1760963c119d4ae184420072b8c461ed',
        'Ocp-Apim-Subscription-Region': 'westeurope',
        'Content-Type': 'application/json',
      })

    return this.http.post(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${lang}`, [{'text': text[0]}, {'text': text[1]},{'text': text[2]},{'text': text[3]},{'text': text[4]}], {headers: headers});
  }
  translateInfo(text:any[] = [],lang:string) {
    const headers =
      new HttpHeaders({
        'Ocp-Apim-Subscription-Key': '1760963c119d4ae184420072b8c461ed',
        'Ocp-Apim-Subscription-Region': 'westeurope',
        'Content-Type': 'application/json',
      })

    return this.http.post(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${lang}`, [{'text': text[0]}, {'text': text[1]}], {headers: headers});
  }
  translateForecast(text:any[] = [],lang:string) {
    const headers =
      new HttpHeaders({
        'Ocp-Apim-Subscription-Key': '1760963c119d4ae184420072b8c461ed',
        'Ocp-Apim-Subscription-Region': 'westeurope',
        'Content-Type': 'application/json',
      })

    return this.http.post(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${lang}`, [{'text': text[0]}, {'text': text[1]},{'text': text[2]}, {'text': text[3]},{'text': text[4]}], {headers: headers});
  }








}


