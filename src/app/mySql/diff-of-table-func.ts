import { IDifference } from './difference-interface';
import { TableFunction } from './table-func';

export class DiffOfTableFunc implements IDifference {
  left: TableFunction;
  right: TableFunction;

  public constructor(val = {}) {
    Object.assign(this, val);
  }


  syncToLeftSql(): string {
    let returnValue = '';
    if (this.left) {
      returnValue = `drop ${this.left.funcType} ${this.left.name}<br/>`;
    }

    if (this.right) {
      returnValue = returnValue + this.right.toDDLString();
    }

    return returnValue.toUpperCase();
  }

  syncToRightSql(): string {
    let returnValue = '';
    if (this.right) {
      returnValue = `drop ${this.right.funcType} ${this.right.name}<br/>`;
    }

    if (this.left) {
      returnValue = returnValue + this.left.toDDLString();
    }

    return returnValue.toUpperCase();
  }
}
