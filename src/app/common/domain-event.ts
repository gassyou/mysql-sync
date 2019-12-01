
export type EventAction = (eventArgs: any) => void;


export class DomainEvent {

  private static readonly instance: DomainEvent = new DomainEvent();

  private actionList: EventAction[] = [];

  constructor() {
    return DomainEvent.instance;
  }

  public static getInstance() {
    return this.instance;
  }

  public raise(eventArgs: any) {
    this.actionList.forEach(
      action => {
        action(eventArgs);
      }
    );
  }

  public Register(action: EventAction) {
    this.actionList.push(action);
  }


}
