import { IComparable } from './comparable-interface';

export interface IDifference {

  name?: string;
  tableName?: string;
  type?: DiffType;
  left: IComparable;
  right: IComparable;

  syncToLeftSql(): string;

  syncToRightSql(): string;

}



export const enum DiffType {
  TABLE = 'table',
  COLUMN = 'column',
  KEY = 'key',
  VIEW = 'view',
  FUNC = 'func',
}
