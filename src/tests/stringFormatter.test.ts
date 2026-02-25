import { describe, it, expect } from "vitest";
import {
  capitalizeFirstLetter,
  trimAndTransform,
} from "../functions/stringFormatter";

describe("Функции форматирования строк", () => {
  describe("capitalizeFirstLetter", () => {
    it("должен преобразовывать первую букву строки в заглавную", () => {
      expect(capitalizeFirstLetter("привет")).toBe("Привет");
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
    });

    it("должен обрабатывать пустую строку", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });

    it("должен обрабатывать строку из одного символа", () => {
      expect(capitalizeFirstLetter("a")).toBe("A");
    });

    it("не должен изменять строку, первая буква которой уже заглавная", () => {
      expect(capitalizeFirstLetter("Hello")).toBe("Hello");
    });
  });

  describe("trimAndTransform", () => {
    it("должен удалять пробельные символы по краям", () => {
      expect(trimAndTransform("  hello  ")).toBe("hello");
      expect(trimAndTransform("\n\tworld\n\t")).toBe("world");
    });

    it("должен удалять пробелы и преобразовывать в верхний регистр, если указано", () => {
      expect(trimAndTransform("  hello  ", true)).toBe("HELLO");
      expect(trimAndTransform("  world  ", true)).toBe("WORLD");
    });

    it("должен обрабатывать пустую строку", () => {
      expect(trimAndTransform("")).toBe("");
      expect(trimAndTransform("", true)).toBe("");
    });

    it("должен обрабатывать строку, состоящую только из пробельных символов", () => {
      expect(trimAndTransform("   ")).toBe("");
      expect(trimAndTransform("\n\t", true)).toBe("");
    });
  });
});
