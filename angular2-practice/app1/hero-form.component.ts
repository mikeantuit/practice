import {Component} from '@angular/core';
import {Hero} from './hero';
@Component({
	moduleId:module.id,
	selector:'hero-form',
	templateUrl:'hero-form.component.html'
})
export class HeroFormComponent{
	public powers:Array<string>=['Really Smart', 'Super Flexible',
            'Super Hot', 'Weather Changer']
    model = new Hero(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');
    private submitted:boolean=false;
    onSubmit(){
    	this.submitted=true;
    }
    newHero(){

    }
    get diagnostic() { return JSON.stringify(this.model); }
}
