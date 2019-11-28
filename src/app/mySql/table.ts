import { TableColumn } from './table-conlumn';
import { TableKey } from './table-key';

export class Table {

  public readonly tableName: string;
  public readonly columns: TableColumn[] ;
  public readonly keys: TableKey[];

  public constructor(val = {}) {
    Object.assign(this, val);
  }

}
