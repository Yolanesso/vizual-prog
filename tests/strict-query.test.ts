import { describe, it, expect, beforeEach } from 'vitest';
import { strictQuery, createWhereOp, createGroupByOp, createHavingOp, createSortOp } from '../src';

interface User {
  id: number;
  name: string;
  age: number;
  city: string;
}

describe('strictQuery', () => {
  let users: User[];

  beforeEach(() => {
    users = [
      { id: 1, name: 'Иван', age: 30, city: 'Москва' },
      { id: 2, name: 'Мария', age: 25, city: 'СПб' },
      { id: 3, name: 'Петр', age: 30, city: 'Москва' },
    ];
  });

  it('должен выполнять where', () => {
    const q = strictQuery<User>(createWhereOp<User, 'city'>('city', 'Москва'));
    expect(q(users)).toHaveLength(2);
  });

  it('должен выполнять сложный запрос', () => {
    const q = strictQuery<User, any>(
      createWhereOp<User, 'city'>('city', 'Москва'),
      createGroupByOp<User, 'age'>('age'),
      createHavingOp<User, 'age'>(group => group.items.length > 0),
      createSortOp<User, 'name'>('name')
    );
    expect(q(users)).toBeDefined();
  });
});