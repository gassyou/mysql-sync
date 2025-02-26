import { TableColumn } from './table-column';
import { TableKey } from './table-key';
import { IComparable } from './comparable-interface';
import { DomainEvent } from '../common/domain-event';
import { DiffOfTable } from './diff-of-table';
import { DiffOfTableColumn } from './diff-of-table-column';
import { DiffOfTableKey } from './diff-of-table-key';

export class Table implements IComparable {

  public readonly name: string;
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
      DomainEvent.getInstance().raise('diff-found', new DiffOfTable({left: this, right: other}));
      hasDiff = true;
    } else {

      this.columns.forEach(
        left => {
          const right = other.columns.find(x => x.name.toUpperCase() === left.name.toUpperCase());
          if (left.findDiff(right)) {
            DomainEvent.getInstance().raise('diff-found', new DiffOfTable({left: this, right: other}));
            DomainEvent.getInstance().raise('diff-found', new DiffOfTableColumn({left, right}));
            hasDiff = true;
          }
        }
      );

      other.columns.forEach(
        right => {
          const left = this.columns.find(x => x.name.toUpperCase()  === right.name.toUpperCase());
          if (!left) {
            DomainEvent.getInstance().raise('diff-found', new DiffOfTable({left: this, right: other}));
            DomainEvent.getInstance().raise('diff-found', new DiffOfTableColumn({left: null, right}));
            hasDiff = true;
          }
        }
      );

      this.keys.forEach(
        left => {
          const right = other.keys.find(x => x.name.toUpperCase()  === left.name.toUpperCase());

          if (left.findDiff(right)) {
            DomainEvent.getInstance().raise('diff-found', new DiffOfTable({left: this, right: other}));
            DomainEvent.getInstance().raise('diff-found', new DiffOfTableKey({left, right}));
            hasDiff = true;
          }
        }
      );

      other.keys.forEach(
        right => {
          const left = this.keys.find(x => x.name.toUpperCase()  === right.name.toUpperCase());
          if (!left) {
            DomainEvent.getInstance().raise('diff-found', new DiffOfTable({left: this, right: other}));
            DomainEvent.getInstance().raise('diff-found', new DiffOfTableKey({left: null, right}));
            hasDiff = true;
          }
        }
      );
    }

    return hasDiff;
  }


}
