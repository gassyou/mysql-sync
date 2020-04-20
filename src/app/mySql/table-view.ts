import { IComparable } from './comparable-interface';
import { DomainEvent } from '../common/domain-event';
import { DiffOfTableView } from './diff-of-table-view';


export class TableView implements IComparable {

  public readonly name: string;
  public readonly viewBody: string;

  public constructor(val = {}) {
    Object.assign(this, val);
  }

  toDDLString(): string {
    return this.viewBody;
  }

  findDiff(other: TableView): boolean {

    if (!other) {
      DomainEvent.getInstance().raise('diff-found', new DiffOfTableView({left: this, right: other}));
      return true;
    } else if ( this.toDDLString().toUpperCase() !== other.toDDLString().toUpperCase()) {
      DomainEvent.getInstance().raise('diff-found', new DiffOfTableView({left: this, right: other}));
      return true;
    }
    return false;
  }

}
