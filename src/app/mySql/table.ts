import { TableColumn } from './table-column';
import { TableKey } from './table-key';
import { ICompare } from './compare-interface';

export class Table implements ICompare {

  public readonly tableName: string;
  public readonly columns: TableColumn[] ;
  public readonly keys: TableKey[];
  public readonly tableDDL: string;

  public constructor(val = {}) {
    Object.assign(this, val);
  }


  toDDLString(): string {
    return this.tableDDL;
  }
  compare(other: Table): boolean {
    return true;
  }


}
