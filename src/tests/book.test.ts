import { describe, it, expect } from "vitest";
import { createBook } from "../functions/book";

describe("createBook", () => {
  it("должен создавать книгу со всеми полями", () => {
    const book = createBook({
      title: "Война и мир",
      author: "Лев Толстой",
      year: 1869,
      genre: "fiction",
    });

    expect(book).toEqual({
      title: "Война и мир",
      author: "Лев Толстой",
      year: 1869,
      genre: "fiction",
    });
  });

  it("должен создавать книгу без поля year", () => {
    const book = createBook({
      title: "Краткая история времени",
      author: "Стивен Хокинг",
      genre: "non-fiction",
    });

    expect(book).toEqual({
      title: "Краткая история времени",
      author: "Стивен Хокинг",
      genre: "non-fiction",
    });
    expect(book.year).toBeUndefined();
  });

  it("должен создавать художественную книгу", () => {
    const book = createBook({
      title: "Преступление и наказание",
      author: "Федор Достоевский",
      genre: "fiction",
    });

    expect(book.genre).toBe("fiction");
  });
});
