import { describe, it, expect } from "vitest";
import { getStatusColor } from "../functions/status";

describe("getStatusColor", () => {
  it("должен возвращать зеленый для статуса active", () => {
    expect(getStatusColor("active")).toBe("green");
  });

  it("должен возвращать красный для статуса inactive", () => {
    expect(getStatusColor("inactive")).toBe("red");
  });

  it("должен возвращать синий для статуса new", () => {
    expect(getStatusColor("new")).toBe("blue");
  });
});
