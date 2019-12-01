import { IComparable } from './comparable-interface';

export interface IDifference {

  left: IComparable;
  right: IComparable;

  syncToLeftSql(): string;

  syncToRightSql(): string;

}
