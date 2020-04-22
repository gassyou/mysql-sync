import { TableKeyType } from './table-key-type';
import { IComparable } from './comparable-interface';

export class TableKey implements IComparable {

  public readonly name: string;
  public readonly tableName: string;
  public readonly keyColumns: string[] = [];
  public readonly referenceTable: string;
  public readonly referenceColumns: string;
  public readonly keyType: TableKeyType;

  public constructor(val = {}) {
    Object.assign(this, val);
  }

  public toDDLString(): string {

    if (this.keyType === TableKeyType.PRIMARY_KEY) {
      return `${TableKeyType.PRIMARY_KEY } (  ${this.keyColumns.join(',')} )`;
    }

    if (this.keyType === TableKeyType.UNIQUE_KEY) {
      return `${TableKeyType.UNIQUE_KEY} ${this.name} ( ${this.keyColumns.join(',')} )`;
    }

    if (this.keyType === TableKeyType.INDEX_KEY) {
      return `${TableKeyType.INDEX_KEY} ${this.name} ( ${this.keyColumns.join(',')} )`;
    }

    if (this.keyType === TableKeyType.FOREIGN_KEY) {
      return `CONSTRAINT ${this.name} ${TableKeyType.FOREIGN_KEY} ( ${this.keyColumns.join(',')} )
              REFERENCES ${this.referenceTable} ( ${this.referenceColumns} )`;
    }

    return '';
  }

  public findDiff( other: TableKey): boolean  {
    if (!other) {
      return true;
    } else if ( this.toDDLString().toUpperCase() !== other.toDDLString().toUpperCase()) {
      return true;
    }
    return false;
  }

}
