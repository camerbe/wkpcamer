import { Injectable } from '@angular/core';
import { SportDetail } from '@wkpcamer/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SportBehaviorService {
  private stateSubject=new BehaviorSubject<SportDetail[]>([]);
  state$=this.stateSubject.asObservable();
  updateState(newState:SportDetail[]){
    this.stateSubject.next(newState);
  }
}
