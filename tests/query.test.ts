import { describe, it, expect, beforeEach } from 'vitest';
import { 
  query, 
  createWhereOp, 
  createGroupByOp, 
  createHavingOp, 
  createSortOp
} from '../src';

interface User {
  id: number;
  name: string;
  age: number;
  city: string;
}

describe('query', () => {
  let users: User[];

  beforeEach(() => {
    users = [
      { id: 1, name: 'Иван', age: 30, city: 'Москва' },
      { id: 2, name: 'Мария', age: 25, city: 'СПб' },
      { id: 3, name: 'Петр', age: 30, city: 'Москва' },
    ];
  });

  it('должен выполнять where', () => {
    const q = query<User>(createWhereOp<User, 'city'>('city', 'Москва'));
    expect(q(users)).toHaveLength(2);
  });

  it('должен выполнять sort', () => {
    const q = query<User>(createSortOp<User, 'age'>('age'));
    const result = q(users);
    expect(result[0].age).toBe(25);
    expect(result[2].age).toBe(30);
  });

  it('должен выполнять groupBy', () => {
    const q = query<User, any>(createGroupByOp<User, 'city'>('city'));
    const result = q(users);
    expect(result).toHaveLength(2);
  });

  it('должен принимать правильную последовательность', () => {
    expect(() => {
      query<User>(
        createWhereOp<User, 'city'>('city', 'Москва'),
        createGroupByOp<User, 'age'>('age'),
        createHavingOp<User, 'age'>(group => group.items.length > 0),
        createSortOp<User, 'name'>('name')
      );
    }).not.toThrow();
  });

  it('должен отклонять having без groupBy', () => {
    expect(() => {
      query<User>(
        createWhereOp<User, 'city'>('city', 'Москва'),
        createHavingOp<User, 'age'>(group => group.items.length > 1)
      );
    }).toThrow('Неверный порядок операций: where -> having');
  });

  it('должен работать без операций', () => {
    expect(query<User>()(users)).toEqual(users);
  });
});