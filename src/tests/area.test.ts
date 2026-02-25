import { describe, it, expect } from "vitest";
import { calculateArea } from "../functions/area";

describe("calculateArea", () => {
  describe("круг", () => {
    it("должен правильно вычислять площадь круга", () => {
      expect(calculateArea("circle", 5)).toBeCloseTo(78.54, 2);
      expect(calculateArea("circle", 0)).toBe(0);
      expect(calculateArea("circle", 1)).toBeCloseTo(3.14, 2);
    });

    it("должен обрабатывать большой радиус", () => {
      expect(calculateArea("circle", 100)).toBeCloseTo(31415.93, 2);
    });
  });

  describe("квадрат", () => {
    it("должен правильно вычислять площадь квадрата", () => {
      expect(calculateArea("square", 4)).toBe(16);
      expect(calculateArea("square", 0)).toBe(0);
      expect(calculateArea("square", 2.5)).toBe(6.25);
    });

    it("должен обрабатывать большую сторону", () => {
      expect(calculateArea("square", 100)).toBe(10000);
    });
  });
});
