import { describe, test, expect } from 'vitest';
import { query, where, sort, groupBy, having } from '../src/query';
import { Group } from '../src/types';

type User = {
  id: number;
  name: string;
  surname: string;
  age: number;
  city: string;
};

const users: User[] = [
  { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
  { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
  { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
];

describe('Query Pipeline', () => {
  test('Фильтрация и сортировка', () => {
    const search = query<User>(
      where<User, "name">("name", "John"),
      sort<User, "age">("age")
    );

    const result = search(users);
    
    expect(result).toBeDefined();
    expect(result[0]!.age).toBe(33); 
  });

  test('Группировка по городу', () => {
    const groupAndFilter = query<User, Group<User, "city">>(
      groupBy<User, "city">("city"),
      having<User, "city">((group) => group.items.length >= 1)
    );

    const result = groupAndFilter(users);
    expect(result[0]?.key).toBeDefined();
  });
});