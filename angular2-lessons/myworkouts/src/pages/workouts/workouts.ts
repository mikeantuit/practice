import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WorkoutService } from '../../services/workout.service';
@Component({
    selector: 'page-home',
    templateUrl: 'workouts.html',
    providers: [WorkoutService]
})
export class WorkoutsPage implements OnInit {
    constructor(public navCtrl: NavController, private _workoutService: WorkoutService) {

    }
    ngOnInit() {
        this._workoutService.getWorkouts().subscribe(workouts => {
            console.log(workouts)
        })
    }
}
