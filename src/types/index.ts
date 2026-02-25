// Общие интерфейсы и типы
export interface User {
  id: number;
  name: string;
  email?: string;
  isActive: boolean;
}

export interface Book {
  title: string;
  author: string;
  year?: number;
  genre: "fiction" | "non-fiction";
}

export type Status = "active" | "inactive" | "new";

export type StringFormatter = (str: string, uppercase?: boolean) => string;

export interface HasId {
  id: number;
}

export interface UserWithId extends HasId {
  name: string;
  email?: string;
}

export interface Product extends HasId {
  name: string;
  price: number;
}
