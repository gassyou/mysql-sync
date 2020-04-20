import { IDifference } from "../mySql/difference-interface";

// export type EventAction = (eventArgs: any) => void;
export type EventType = 'diff-found' | 'progress';

export interface EventAction {
  eventType: EventType;
  handle: (eventArgs: IDifference | Number) => void
}

export class DomainEvent {

  private static readonly instance: DomainEvent = new DomainEvent();

  private actionList: EventAction[] = [];

  constructor() {
    return DomainEvent.instance;
  }

  public static getInstance() {
    return this.instance;
  }

  public raise(eventType: EventType, eventArgs: IDifference | Number) {

    const actions = this.actionList.filter(action => action.eventType === eventType);
    actions.forEach(
      action => {
        action.handle(eventArgs);
    });
  }

  public Register(action: EventAction) {
    this.actionList.push(action);
  }


}
