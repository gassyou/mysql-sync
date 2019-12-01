import { ICompare } from './compare-interface';

export interface IDifference {

  left: ICompare;
  right: ICompare;

  syncToLeftSql(): string;

  syncToRightSql(): string;

}
