import { Injectable } from '@angular/core';
import { ArticleDetail } from '@wkpcamer/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleForIndexService {
  private stateSubject=new BehaviorSubject<ArticleDetail[]>([]);
  state$=this.stateSubject.asObservable();
  updateState(newState:ArticleDetail[]){
    this.stateSubject.next(newState);
  }
}
