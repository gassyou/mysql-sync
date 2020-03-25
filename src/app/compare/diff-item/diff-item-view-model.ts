export interface DiffItemViewModel {
  id: string;
  type: DiffType;
  title_1: string;
  title_2: string;
  styleClass: string;
  isSelected: boolean;
  items:DiffItemViewModel[];
  sql1: string;
  sql2: string;
}


export const enum DiffType {
  TABLE = 'table',
  COLUMN = 'column',
  KEY = 'key',
  VIEW = 'view',
  FUNC = 'func',
}
