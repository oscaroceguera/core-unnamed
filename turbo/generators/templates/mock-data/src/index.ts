import usersData from "../data/users.json" with { type: "json" };

export type UserRole = "admin" | "editor" | "member";

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatarUrl: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export const users: MockUser[] = usersData as MockUser[];
