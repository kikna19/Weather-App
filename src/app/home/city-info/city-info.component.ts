import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons/faTimesCircle";

@Component({
  selector: 'app-city-info',
  template: '<div><h2>{{data.header}}</h2> <br> <p>{{data.info}}</p> <fa-icon (click)="closeSheet()" [icon]="time"></fa-icon> </div>',
  styles: ['h2{font-family: "Arial Black"; color: #8d5614} p:first-letter{color: #721010; font-family:"Source Code Pro"; font-size: 1.4rem} p{ font-family: "Times New Roman", Times, serif;  font-size: 1.1rem; text-indent: 1rem; letter-spacing: .1rem;} div{position: relative;display: flex; align-items: center; flex-wrap: nowrap;  flex-direction: column; width: 100%; height: 90%} fa-icon{position: absolute; top: -.4rem; right: -.9rem; font-size: 1.5rem; cursor: pointer}'],
  styleUrls: ['./city-info.component.scss']
})
export class CityInfoComponent implements OnInit {
  time = faTimesCircle;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {header: string, info: string;}, private close: MatBottomSheetRef<CityInfoComponent>) { }

  ngOnInit(): void {
  }
  closeSheet(){
    this.close.dismiss();
  }

}
