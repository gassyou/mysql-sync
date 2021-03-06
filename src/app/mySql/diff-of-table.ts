import { IDifference, DiffType } from './difference-interface';
import { Table } from './table';

export class DiffOfTable implements IDifference {


  public readonly name?: string;
  public readonly tableName?: string;
  public readonly type?: DiffType;
  public readonly left: Table;
  public readonly right: Table;

  public constructor(val = {}) {
    Object.assign(this, val);

    this.name = this.left? this.left.name:this.right.name;
    this.tableName = this.name;
    this.type = DiffType.TABLE;
  }

  syncToLeftSql(): string {

    let returnValue = '';
    if (this.left) {
      returnValue = `drop table ${this.left.name};<br/>`;
    }

    if (this.right) {
      returnValue = returnValue + this.right.toDDLString();
    }

    return returnValue;
  }


  syncToRightSql(): string {

    let returnValue = '';
    if (this.right) {
      returnValue = `drop table ${this.right.name};<br/>`;
    }

    if (this.left) {
      returnValue = returnValue + this.left.toDDLString();
    }

    return returnValue;

  }

}
