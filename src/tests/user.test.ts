import { describe, it, expect } from "vitest";
import { createUser } from "../functions/user";

describe("createUser", () => {
  it("должен создавать пользователя только с обязательными полями", () => {
    const user = createUser(1, "Иван Петров");

    expect(user).toEqual({
      id: 1,
      name: "Иван Петров",
      isActive: true,
    });
    expect(user.email).toBeUndefined();
  });

  it("должен создавать пользователя со всеми полями", () => {
    const user = createUser(2, "Мария Сидорова", false, "maria@example.com");

    expect(user).toEqual({
      id: 2,
      name: "Мария Сидорова",
      email: "maria@example.com",
      isActive: false,
    });
  });

  it("должен создавать пользователя с пользовательскими значениями isActive и email", () => {
    const user = createUser(3, "Петр Иванов", true, "petr@example.com");

    expect(user).toEqual({
      id: 3,
      name: "Петр Иванов",
      email: "petr@example.com",
      isActive: true,
    });
  });
});
