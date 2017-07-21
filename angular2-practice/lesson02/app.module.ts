
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './component/navbar/navbar.component';
import { JumbotronComponent } from './component/jumbotron/jumbotron.component';
import { HomeComponent } from './component/pages/home.component';
import { AboutComponent } from './component/pages/about.component';
import { SearchComponent } from './component/search/search.component';
import { routing } from './app.routing';
import { ProfileComponent } from './component/profile/profile.component';
import { ArtistComponent } from './component/artist/artist.component';
import { AlbumsComponent } from './component/albums/albums.component';
import { HttpModule } from '@angular/http';

@NgModule({
  imports:      [ BrowserModule,FormsModule ,routing,HttpModule],
  declarations: [ AppComponent ,
  				NavbarComponent,
  				JumbotronComponent,
  				AboutComponent,
  				HomeComponent,
  				ProfileComponent,
  				SearchComponent,
				ArtistComponent,
				AlbumsComponent
  				],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }