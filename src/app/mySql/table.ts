import { TableColumn } from './table-column';
import { TableKey } from './table-key';
import { IComparable } from './comparable-interface';
import { DomainEvent } from '../common/domain-event';

export class Table implements IComparable {

  public readonly tableName: string;
  public readonly columns: TableColumn[] = [];
  public readonly keys: TableKey[] = [];
  public readonly tableDDL: string;

  public constructor(val = {}) {
    Object.assign(this, val);
  }


  toDDLString(): string {
    return this.tableDDL;
  }

  findDiff(other: Table): boolean {

    let hasDiff = false;
    if (!other)  {
      DomainEvent.getInstance().raise({left: this, right: other});
      hasDiff = true;
    } else {

      this.columns.forEach(
        left => {
          const right = other.columns.find(x => x.columnName === left.columnName);
          if (left.findDiff(right)) {
            hasDiff = true;
          }
        }
      );

      other.columns.forEach(
        right => {
          const left = this.columns.find(x => x.columnName === right.columnName);
          if (!left) {
            DomainEvent.getInstance().raise({left: null, right});
            hasDiff = true;
          }
        }
      );

      this.keys.forEach(
        left => {
          const right = other.keys.find(x => x.keyName === left.keyName);
          if (left.findDiff(right)) {
            hasDiff = true;
          }
        }
      );

      other.keys.forEach(
        right => {
          const left = other.keys.find(x => x.keyName === right.keyName);
          if (!left) {
            DomainEvent.getInstance().raise({left: null, right});
            hasDiff = true;
          }
        }
      );
    }

    return hasDiff;
  }


}
