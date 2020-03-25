import { IDifference } from './difference-interface';
import { Table } from './table';

export class DiffOfTable implements IDifference {

  public readonly left: Table;
  public readonly right: Table;

  public constructor(val = {}) {
    Object.assign(this, val);
  }

  syncToLeftSql(): string {

    let returnValue = '';
    if (this.left) {
      returnValue = `drop table ${this.left.name}<br/>`;
    }

    if (this.right) {
      returnValue = returnValue + this.right.toDDLString();
    }

    return returnValue.toUpperCase();
  }


  syncToRightSql(): string {

    let returnValue = '';
    if (this.right) {
      returnValue = `drop table ${this.right.name}<br/>`;
    }

    if (this.left) {
      returnValue = returnValue + this.left.toDDLString();
    }

    return returnValue.toUpperCase();

  }

}
