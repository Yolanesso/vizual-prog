import { User } from "../types";

export function createUser(
  id: number,
  name: string,
  isActive: boolean = true,
  email?: string,
): User {
  const user: User = {
    id,
    name,
    isActive,
  };

  if (email !== undefined) {
    user.email = email;
  }

  return user;
}
