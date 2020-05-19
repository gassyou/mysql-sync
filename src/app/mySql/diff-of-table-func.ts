import { IDifference, DiffType } from './difference-interface';
import { TableFunction } from './table-func';

export class DiffOfTableFunc implements IDifference {


  public readonly name?: string;
  public readonly tableName?: string;
  public readonly type?: DiffType;
  left: TableFunction;
  right: TableFunction;

  public constructor(val = {}) {
    Object.assign(this, val);

    this.name = this.left? this.left.name:this.right.name;
    this.tableName = null;
    this.type = DiffType.FUNC;
  }


  syncToLeftSql(): string {
    let returnValue = '';
    if (this.left) {
      returnValue = `drop ${this.left.funcType} ${this.left.name};<br/>`;
    }

    if (this.right) {
      returnValue = returnValue + this.right.toDDLString();
    }

    return returnValue;
  }

  syncToRightSql(): string {
    let returnValue = '';
    if (this.right) {
      returnValue = `drop ${this.right.funcType} ${this.right.name};<br/>`;
    }

    if (this.left) {
      returnValue = returnValue + this.left.toDDLString();
    }

    return returnValue;
  }
}
