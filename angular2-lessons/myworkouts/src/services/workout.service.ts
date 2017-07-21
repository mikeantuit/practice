import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class WorkoutService {
    private apiKey: string = '7AOeJefIRO-zu4uhmfFJyL0fKbfzA5So';
    private workoutsUrl: string = 'https://api.mlab.com/api/1/databases/myworkoutsapp/collections/workouts';
    constructor(private _http: Http) {
        // this.apikey='8r0O9h5dXL5QFaZJ8KuVLf14k-oH1BPS';
        // this.workoutsUrl='http://api.mlab.com/api/1/databases';
    }
    getWorkouts() {
        return this._http.get(this.workoutsUrl + '?apiKey=' + this.apiKey)
            .map(res => res.json())
    }
    addWorkout(workout) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this.workoutsUrl + '?apiKey=' + this.apiKey, JSON.stringify(workout),
            { headers: headers })
            .map(res => res.json());
    }

    deleteWorkout(workoutId) {
        return this._http.delete(this.workoutsUrl + '/' + workoutId + '?apiKey=' + this.apiKey)
            .map(res => res.json());
    }

}