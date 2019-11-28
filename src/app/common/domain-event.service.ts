import { Injectable } from '@angular/core';

type Callback = (eventArgs: any) => void;

@Injectable({
  providedIn: 'root'
})
export class DomainEventService {

  private actionList: Callback[] = [];

  constructor() { }

  public raise(eventArgs: any) {
    this.actionList.forEach(
      action => {
        action(eventArgs);
      }
    );
  }

  public Register(action: Callback) {
    this.actionList.push(action);
  }


}
