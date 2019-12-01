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
    if (this.left !== null) {
      returnValue = `drop table ${this.left.tableName}<br/>`;
    }

    if (this.right !== null) {
      returnValue = returnValue + this.right.toDDLString();
    }

    return returnValue.toUpperCase();
  }


  syncToRightSql(): string {

    let returnValue = '';
    if (this.right !== null) {
      returnValue = `drop table ${this.right.tableName}<br/>`;
    }

    if (this.left !== null) {
      returnValue = returnValue + this.left.toDDLString();
    }

    return returnValue.toUpperCase();

  }

}
