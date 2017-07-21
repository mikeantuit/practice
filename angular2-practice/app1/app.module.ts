
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { FormsModule } from '@angular/forms';
import { HeroFormComponent } from './hero-form.component';
@NgModule({
  imports:      [ BrowserModule,FormsModule ],
  declarations: [ AppComponent ,HeroFormComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }