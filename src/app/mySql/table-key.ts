import { TableKeyType } from './table-key-type';
import { ICompare } from './compare-interface';

export class TableKey implements ICompare {

  public readonly tableName: string;
  public readonly keyName: string;
  public readonly keyColumns: string[] = [];
  public readonly referenceTable: string;
  public readonly referenceColumns: string[] = [];
  public readonly keyType: TableKeyType;

  public constructor(val = {}) {
    Object.assign(this, val);
  }

  public toDDLString(): string {

    if (this.keyType === TableKeyType.PRIMARY_KEY) {
      return TableKeyType.PRIMARY_KEY + ' ' + this.keyName + ' ( ' + this.keyColumns.join(',') + ' )';
    }

    if (this.keyType === TableKeyType.UNIQUE_KEY) {
      return TableKeyType.UNIQUE_KEY + ' ' + this.keyName + ' ( ' + this.keyColumns.join(',') + ' )';
    }

    if (this.keyType === TableKeyType.INDEX_KEY) {
      return TableKeyType.INDEX_KEY + ' ' +  this.keyName + ' ( ' + this.keyColumns.join(',') + ' )';
    }

    if (this.keyType === TableKeyType.FOREIGN_KEY) {
      return 'CONSTRAINT ' + this.keyName  + ' ' + TableKeyType.FOREIGN_KEY + ' ( ' + this.keyColumns.join(',') + ' )'
              + 'REFERENCES ' + this.referenceTable + ' ( ' + this.referenceColumns.join(',') + ' )';
    }

    return '';
  }

  public compare( other: TableKey): boolean {
    return this.toDDLString().toUpperCase() === other.toDDLString().toUpperCase();
  }

}
