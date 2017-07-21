import { Component } from '@angular/core';
import { GithubService } from './service/github.service';
import { SpotifyService } from './service/spotify.service';

@Component({
  selector: 'my-app',
  template: `<navbar></navbar>
  			<jumbotron></jumbotron>
			<router-outlet></router-outlet>
  			`,
  providers:[GithubService,SpotifyService]
})
export class AppComponent  { 
	
}