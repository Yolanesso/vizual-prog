import { describe, it, expect, beforeEach } from 'vitest';
import { where, sort, groupBy, having } from '../src/operations';

interface User {
  id: number;
  name: string;
  age: number;
  city: string;
}

describe('operations', () => {
  let users: User[];

  beforeEach(() => {
    users = [
      { id: 1, name: 'Иван', age: 30, city: 'Москва' },
      { id: 2, name: 'Мария', age: 25, city: 'СПб' },
      { id: 3, name: 'Петр', age: 30, city: 'Москва' },
    ];
  });

  it('where фильтрует', () => {
    const result = where<User, 'city'>('city', 'Москва')(users);
    expect(result).toHaveLength(2);
  });

  it('sort сортирует', () => {
    const result = sort<User, 'age'>('age')(users);
    expect(result[0].age).toBe(25);
    expect(result[2].age).toBe(30);
  });

  it('groupBy группирует', () => {
    const result = groupBy<User, 'city'>('city')(users);
    expect(result).toHaveLength(2);
    expect(result[0].key).toBe('Москва');
    expect(result[0].items).toHaveLength(2);
  });

  it('having фильтрует группы', () => {
    const groups = groupBy<User, 'city'>('city')(users);
    const result = having<User, 'city'>(g => g.items.length > 1)(groups);
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('Москва');
  });
});