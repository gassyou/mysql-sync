import { IComparable } from './comparable-interface';
import { DomainEvent } from '../common/domain-event';
import { DiffOfTableFunc } from './diff-of-table-func';


export class TableFunction implements IComparable {

  public readonly name: string;
  public readonly funcType: string;
  public readonly funcBody: string;

  public constructor(val = {}) {
    Object.assign(this, val);
  }

  toDDLString(): string {
    return this.funcBody;
  }

  findDiff(other: TableFunction): boolean {

    if (!other) {
      DomainEvent.getInstance().raise('diff-found',new DiffOfTableFunc({left: this, right: other}));
      return true;
    } else if ( this.toDDLString().toUpperCase() !== other.toDDLString().toUpperCase()) {
      DomainEvent.getInstance().raise('diff-found',new DiffOfTableFunc({left: this, right: other}));
      return true;
    }
    return false;
  }

}
