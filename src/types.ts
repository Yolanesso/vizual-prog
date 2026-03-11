export type Transform<T> = (data: T[]) => T[];

export type Group<T, K extends keyof T> = {
  key: T[K];
  items: T[];
};

export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

export type Where = <T, K extends keyof T>(key: K, value: T[K]) => Transform<T>;

export type Sort = <T, K extends keyof T>(key: K) => Transform<T>;

export type GroupBy = <T, K extends keyof T>(key: K) => (data: T[]) => Group<T, K>[];

export type Having = <T, K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;

export type QueryStage = 'where' | 'groupBy' | 'having' | 'sort';

export interface BaseOp {
  type: QueryStage;
  fn: Function;
}

export interface WhereOp extends BaseOp {
  type: 'where';
}

export interface GroupByOp extends BaseOp {
  type: 'groupBy';
}

export interface HavingOp extends BaseOp {
  type: 'having';
}

export interface SortOp extends BaseOp {
  type: 'sort';
}

export type QueryOp = WhereOp | GroupByOp | HavingOp | SortOp;

export type AllowedNextStage<Current extends QueryStage | undefined> = 
  Current extends undefined ? 'where' | 'groupBy' | 'having' | 'sort' :
  Current extends 'where' ? 'where' | 'groupBy' | 'having' | 'sort' :
  Current extends 'groupBy' ? 'groupBy' | 'having' | 'sort' :
  Current extends 'having' ? 'having' | 'sort' :
  Current extends 'sort' ? 'sort' :
  never;