import { describe, it, expect } from "vitest";
import { findById } from "../functions/findById";
import { UserWithId, Product } from "../types/index";

describe("findById", () => {
  const users: UserWithId[] = [
    { id: 1, name: "Иван" },
    { id: 2, name: "Мария", email: "maria@mail.ru" },
    { id: 3, name: "Петр" },
  ];

  const products: Product[] = [
    { id: 101, name: "Ноутбук", price: 50000 },
    { id: 102, name: "Мышь", price: 1500 },
    { id: 103, name: "Клавиатура", price: 3000 },
  ];

  describe("с массивом пользователей", () => {
    it("должен находить пользователя по существующему id", () => {
      const user = findById(users, 2);
      expect(user).toEqual({ id: 2, name: "Мария", email: "maria@mail.ru" });
    });

    it("должен возвращать undefined для несуществующего id", () => {
      const user = findById(users, 99);
      expect(user).toBeUndefined();
    });

    it("должен находить первого пользователя", () => {
      const user = findById(users, 1);
      expect(user).toEqual({ id: 1, name: "Иван" });
    });
  });

  describe("с массивом продуктов", () => {
    it("должен находить продукт по существующему id", () => {
      const product = findById(products, 103);
      expect(product).toEqual({ id: 103, name: "Клавиатура", price: 3000 });
    });

    it("должен возвращать undefined для несуществующего id", () => {
      const product = findById(products, 999);
      expect(product).toBeUndefined();
    });
  });

  describe("граничные случаи", () => {
    it("должен обрабатывать пустой массив", () => {
      const emptyArray: UserWithId[] = [];
      expect(findById(emptyArray, 1)).toBeUndefined();
    });

    it("должен обрабатывать массив с одним элементом", () => {
      const singleItem: Product[] = [{ id: 1, name: "Test", price: 100 }];
      expect(findById(singleItem, 1)).toEqual({
        id: 1,
        name: "Test",
        price: 100,
      });
    });
  });
});
