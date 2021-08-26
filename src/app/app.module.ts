import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {GetWeatherService} from "./services/get-weather.service";
import {HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import { HomeComponent } from './home/home.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {FeatherModule} from "angular-feather";
import {Camera} from "angular-feather/icons";
import {Sunrise} from "angular-feather/icons";
import {Sunset} from "angular-feather/icons";
import {Wind} from "angular-feather/icons";
import {Compass} from "angular-feather/icons";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { CityInfoComponent } from './home/city-info/city-info.component';
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatDividerModule} from "@angular/material/divider";

const icons = {
  Camera,
  Sunrise,
  Sunset,
  Wind,
  Compass
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CityInfoComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatToolbarModule,
        FontAwesomeModule,
        FeatherModule.pick(icons),
        MatButtonModule,
        MatInputModule,
        MatSlideToggleModule,
        MatBottomSheetModule,
        MatDividerModule
    ],
  exports: [FeatherModule],
  providers: [GetWeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
