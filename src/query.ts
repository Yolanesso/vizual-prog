import { QueryOp, QueryStage, Group } from './types';
import { validateSequence } from './validators';

export function createWhereOp<T, K extends keyof T>(
  key: K, 
  value: T[K]
): QueryOp {
  return {
    type: 'where',
    fn: (data: T[]) => data.filter(item => item[key] === value)
  };
}

export function createGroupByOp<T, K extends keyof T>(
  key: K
): QueryOp {
  return {
    type: 'groupBy',
    fn: (data: T[]) => {
      const map = new Map<any, Group<T, K>>();
      data.forEach((item) => {
        const val = item[key];
        if (!map.has(val)) {
          map.set(val, { key: val, items: [] });
        }
        map.get(val)!.items.push(item);
      });
      return Array.from(map.values());
    }
  };
}

export function createHavingOp<T, K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
): QueryOp {
  return {
    type: 'having',
    fn: (groups: Group<T, K>[]) => groups.filter(predicate)
  };
}

export function createSortOp<T, K extends keyof T>(
  key: K
): QueryOp {
  return {
    type: 'sort',
    fn: (data: T[]) => [...data].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av == null || bv == null) return 0;
      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    })
  };
}

export function query<TIn, TOut = TIn>(
  ...steps: QueryOp[]
): (data: TIn[]) => TOut[] {
  const stages = steps.map(step => step.type) as QueryStage[];
  
  validateSequence(stages);

  return (data: TIn[]): TOut[] => {
    let result: any = data;
    
    for (const step of steps) {
      result = step.fn(result);
    }
    
    return result as TOut[];
  };
}