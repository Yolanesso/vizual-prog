import { describe, it, expect } from "vitest";
import { getFirstElement } from "../functions/array";

describe("getFirstElement", () => {
  it("должен возвращать первый элемент числового массива", () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(getFirstElement(numbers)).toBe(1);
  });

  it("должен возвращать первый элемент строкового массива", () => {
    const strings = ["a", "b", "c"];
    expect(getFirstElement(strings)).toBe("a");
  });

  it("должен возвращать первый элемент смешанного массива", () => {
    const mixed = [true, "hello", 42];
    expect(getFirstElement(mixed)).toBe(true);
  });

  it("должен возвращать undefined для пустого массива", () => {
    const emptyArray: number[] = [];
    expect(getFirstElement(emptyArray)).toBeUndefined();
  });

  it("должен работать с массивом объектов", () => {
    const objects = [{ id: 1 }, { id: 2 }];
    expect(getFirstElement(objects)).toEqual({ id: 1 });
  });
});
