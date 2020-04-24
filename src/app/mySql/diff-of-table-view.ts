import { IDifference, DiffType } from './difference-interface';
import { TableView } from './table-view';

export class DiffOfTableView implements IDifference {


  public readonly name?: string;
  public readonly tableName?: string;
  public readonly type?: DiffType;
  public readonly left: TableView;
  public readonly right: TableView;

  public constructor(val = {}) {
    Object.assign(this, val);

    this.name = this.left? this.left.name:this.right.name;
    this.tableName = null;
    this.type = DiffType.VIEW;
  }

  syncToLeftSql(): string {
    let returnValue = '';
    if (this.left) {
      returnValue = `drop ${this.left.name};<br/>`;
    }

    if (this.right) {
      returnValue = returnValue + `CREATE VIEW ${this.right.name} AS ` + this.right.toDDLString();
    }

    return returnValue.toUpperCase();
  }

  syncToRightSql(): string {
    let returnValue = '';
    if (this.right) {
      returnValue = `drop ${this.right.name};<br/>`;
    }

    if (this.left) {
      returnValue = returnValue + `CREATE VIEW ${this.left.name} AS ` + this.left.toDDLString();
    }

    return returnValue.toUpperCase();
  }
}
