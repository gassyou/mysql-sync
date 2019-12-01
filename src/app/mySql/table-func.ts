import { ICompare } from './compare-interface';

export class TableFunction implements ICompare {

  public readonly funcName: string;
  public readonly funcType: string;
  public readonly funcBody: string;

  public constructor(val = {}) {
    Object.assign(this, val);
  }

  toDDLString(): string {
    return this.funcBody;
  }

  compare(other: TableFunction): boolean {
    return this.funcBody.toLowerCase() === other.funcBody.toLowerCase();
  }

}
