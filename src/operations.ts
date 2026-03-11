import { Transform, Group, Where, Sort, GroupBy, Having } from './types';

export const where: Where = (key, value) => (data) =>
  data.filter((item) => item[key] === value);

export const sort: Sort = (key) => (data) =>
  [...data].sort((a, b) => {
    const av = a[key];
    const bv = b[key];

    if (av == null || bv == null) return 0;
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });

export const groupBy: GroupBy = (key) => (data) => {
  const map = new Map<any, Group<any, any>>();
  
  data.forEach((item) => {
    const val = item[key];
    if (!map.has(val)) {
      map.set(val, { key: val, items: [] });
    }
    map.get(val)!.items.push(item);
  });
  
  return Array.from(map.values());
};

export const having: Having = (predicate) => (groups) =>
  groups.filter(predicate);