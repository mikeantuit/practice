import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../service/spotify.service';
import { Artist } from '../artist';
import { Album } from '../album';

@Component({
    moduleId:module.id,
    selector:'albums',
    templateUrl:'albums.component.html'
})
export class AlbumsComponent implements OnInit{
    id:string;
    artist:Artist[];
    album:Album[];
    constructor(private _spotifyService:SpotifyService,private _route:ActivatedRoute){

    }
    ngOnInit(){
        this._route.params.map(params=>params['id'])
        .subscribe((id)=>{
            this._spotifyService.getAlbum(id)
                .subscribe(album=>{this.album=album;})
        })
    }
}