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
    if (this.right) {
      returnValue = `CREATE OR REPLACE VIEW ${this.right.name} AS ` + this.right.toDDLString();
    }

    return returnValue;
  }

  syncToRightSql(): string {
    let returnValue = '';
    if (this.left) {
      returnValue = `CREATE OR REPLACE VIEW ${this.left.name} AS ` + this.left.toDDLString();
    }

    return returnValue;
  }
}
