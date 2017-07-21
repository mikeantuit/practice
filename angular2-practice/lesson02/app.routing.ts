import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './component/pages/home.component';
import {AboutComponent} from './component/pages/about.component';
import {ProfileComponent} from './component/profile/profile.component';
import { SearchComponent } from './component/search/search.component';
import { ArtistComponent } from './component/artist/artist.component';
import { AlbumsComponent } from './component/albums/albums.component';



const appRoutes:Routes=[
	{
		path:'',
		component:HomeComponent
	},{
		path:'about',
		component:AboutComponent
	},{
		path:'profile',
		component:ProfileComponent
	},{
		path:'search',
		component:SearchComponent
	},{
		path: 'artist/:id',
        component:ArtistComponent
	},{
		path: 'albums/:id',
        component:AlbumsComponent
	}
]
 export const routing:ModuleWithProviders=RouterModule.forRoot(appRoutes)