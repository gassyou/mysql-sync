import { IComparable } from './comparable-interface';
import { DomainEvent } from '../common/domain-event';


export class TableView implements IComparable {

  public readonly viewName: string;
  public readonly viewBody: string;

  public constructor(val = {}) {
    Object.assign(this, val);
  }

  toDDLString(): string {
    return this.viewBody;
  }

  findDiff(other: TableView): boolean {

    if (!other) {
      DomainEvent.getInstance().raise({left: this, right: other});
      return true;
    } else if ( this.toDDLString().toUpperCase() !== other.toDDLString().toUpperCase()) {
      DomainEvent.getInstance().raise({left: this, right: other});
      return true;
    }
    return false;
  }

}
