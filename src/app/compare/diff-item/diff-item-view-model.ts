export interface DiffItemViewModel {
  id: string;
  title_1: string;
  title_2: string;
  styleClass: string;
  isSelected: boolean;
  items?:DiffItemViewModel[];
}
