import { describe, it } from 'vitest';
import { expectTypeOf } from 'vitest';
import { DeepReadonly, PickedByType, EventHandlers } from '../types/utils';

describe('Утилитарные типы', () => {
  describe('DeepReadonly', () => {
    it('должен делать все свойства объекта readonly', () => {
      interface User {
        name: string;
        age: number;
        address: {
          city: string;
          street: string;
        };
        hobbies: string[];
      }

      type ReadonlyUser = DeepReadonly<User>;

      expectTypeOf<ReadonlyUser>().toHaveProperty('name').toBeString();
      expectTypeOf<ReadonlyUser>().toHaveProperty('age').toBeNumber();
      
      expectTypeOf<ReadonlyUser['address']>().toHaveProperty('city').toBeString();
      expectTypeOf<ReadonlyUser['address']>().toHaveProperty('street').toBeString();
      
      expectTypeOf<ReadonlyUser['hobbies']>().toEqualTypeOf<readonly string[]>();
    });
  });

  describe('PickedByType', () => {
    it('должен выбирать свойства указанного типа', () => {
      interface TestObject {
        name: string;
        age: number;
        email: string;
        isActive: boolean;
        score: number;
      }

      type StringProperties = PickedByType<TestObject, string>;

      expectTypeOf<StringProperties>().toHaveProperty('name').toBeString();
      expectTypeOf<StringProperties>().toHaveProperty('email').toBeString();
      
      expectTypeOf<StringProperties>().not.toHaveProperty('age');
      expectTypeOf<StringProperties>().not.toHaveProperty('isActive');
      expectTypeOf<StringProperties>().not.toHaveProperty('score');
    });
  });

  describe('EventHandlers', () => {
    it('должен генерировать обработчики для событий', () => {
      interface Events {
        click: [number, number];
        change: [string];
        focus: [];
      }

      type Handlers = EventHandlers<Events>;

      expectTypeOf<Handlers>().toHaveProperty('onClick').toBeFunction();
      expectTypeOf<Handlers>().toHaveProperty('onChange').toBeFunction();
      expectTypeOf<Handlers>().toHaveProperty('onFocus').toBeFunction();
      
      expectTypeOf<Handlers['onClick']>().parameters.toEqualTypeOf<[number, number]>();
      expectTypeOf<Handlers['onChange']>().parameters.toEqualTypeOf<[string]>();
      expectTypeOf<Handlers['onFocus']>().parameters.toEqualTypeOf<[]>();
    });
  });
});