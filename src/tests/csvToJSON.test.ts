import { describe, it, expect } from "vitest";
import { csvToJSON } from "../functions/csvToJSON";

describe("csvToJSON", () => {
  describe("корректные входные данные", () => {
    it("должен преобразовывать CSV с точкой с запятой в JSON", () => {
      const input = ["p1;p2;p3;p4", "1;A;b;c", "2;B;v;d"];
      const result = csvToJSON(input, ";");

      expect(result).toEqual([
        { p1: 1, p2: "A", p3: "b", p4: "c" },
        { p1: 2, p2: "B", p3: "v", p4: "d" },
      ]);
    });

    it("должен преобразовывать CSV с запятой в JSON", () => {
      const input = ["name,age,city", "Иван,25,Москва", "Мария,30,СПб"];
      const result = csvToJSON(input, ",");

      expect(result).toEqual([
        { name: "Иван", age: 25, city: "Москва" },
        { name: "Мария", age: 30, city: "СПб" },
      ]);
    });

    it("должен преобразовывать числа в числовой тип", () => {
      const input = ["id;value", "1;42", "2;3.14"];
      const result = csvToJSON(input, ";");

      expect(result).toEqual([
        { id: 1, value: 42 },
        { id: 2, value: 3.14 },
      ]);
    });

    it("должен пропускать пустые строки", () => {
      const input = ["a;b", "1;2", "", "3;4", "  "];
      const result = csvToJSON(input, ";");

      expect(result).toEqual([
        { a: 1, b: 2 },
        { a: 3, b: 4 },
      ]);
    });

    it("должен обрабатывать одну строку данных", () => {
      const input = ["name;age", "Петр;35"];
      const result = csvToJSON(input, ";");

      expect(result).toEqual([{ name: "Петр", age: 35 }]);
    });
  });

  describe("некорректные входные данные", () => {
    it("должен выбрасывать ошибку при пустом массиве", () => {
      expect(() => csvToJSON([], ";")).toThrow(
        "Входной массив не может быть пустым",
      );
    });

    it("должен выбрасывать ошибку при пустом разделителе", () => {
      expect(() => csvToJSON(["a;b", "1;2"], "")).toThrow(
        "Разделитель не может быть пустым",
      );
    });

    it("должен выбрасывать ошибку при пустой первой строке", () => {
      expect(() => csvToJSON([""], ";")).toThrow(
        "Первая строка не может быть пустой",
      );
    });

    it("должен выбрасывать ошибку при несоответствии количества полей", () => {
      const input = ["a;b;c", "1;2", "3;4;5"];

      expect(() => csvToJSON(input, ";")).toThrow(
        "Несоответствие количества полей в строке 2: ожидалось 3, получено 2",
      );
    });

    it("должен возвращать пустой массив при отсутствии строк с данными", () => {
      const input = ["a;b"];

      expect(csvToJSON(input, ";")).toEqual([]);
    });
  });
});
