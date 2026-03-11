import { describe, it, expect } from 'vitest';
import { 
  createWhereOp, createGroupByOp, createHavingOp, createSortOp,
  strictQuery
} from '../src';

interface User {
  id: number;
  name: string;
  age: number;
  city: string;
}

describe('types', () => {
  it('создает where операцию', () => {
    const op = createWhereOp<User, 'city'>('city', 'Москва');
    expect(op.type).toBe('where');
  });

  it('создает groupBy операцию', () => {
    const op = createGroupByOp<User, 'age'>('age');
    expect(op.type).toBe('groupBy');
  });

  it('создает having операцию', () => {
    const op = createHavingOp<User, 'age'>(g => g.items.length > 1);
    expect(op.type).toBe('having');
  });

  it('создает sort операцию', () => {
    const op = createSortOp<User, 'name'>('name');
    expect(op.type).toBe('sort');
  });

  it('strictQuery принимает правильную последовательность', () => {
    const q = strictQuery<User>(
      createWhereOp<User, 'city'>('city', 'Москва'),
      createGroupByOp<User, 'age'>('age'),
      createHavingOp<User, 'age'>(g => g.items.length > 1),
      createSortOp<User, 'name'>('name')
    );
    expect(typeof q).toBe('function');
  });
});